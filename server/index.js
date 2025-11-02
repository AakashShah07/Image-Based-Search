require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('./passport-setup');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const axios = require('axios');

const User = require('./models/User');
const Search = require('./models/Search');

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(passport.initialize());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>console.log('Mongo connected'))
.catch(e=>console.error(e));

// ----- Auth routes (issue JWT on success) -----
function issueJwtAndRedirect(res, user) {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  // frontend route to receive token and store it: e.g. http://localhost:3000/auth/success?token=...
  res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/success?token=${token}`);
}

app.get('/auth/google', passport.authenticate('google', { scope: ['profile','email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  issueJwtAndRedirect(res, req.user);
});

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { session: false }), (req, res) => {
  issueJwtAndRedirect(res, req.user);
});

// app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
// app.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
//   issueJwtAndRedirect(res, req.user);
// });

// ----- Middleware to protect API endpoints -----
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Missing auth' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid auth header' });
  const token = parts[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.userId = payload.id;
    next();
  });
}

// ----- POST /api/search -----
app.post('/api/search', authMiddleware, async (req, res) => {
  try {
    const { term } = req.body;
    if (!term) return res.status(400).json({ message: 'term is required' });

    // Save search record
    await Search.create({ userId: req.userId, term });

    // Query Unsplash
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(term)}&per_page=30`;
    const response = await axios.get(unsplashUrl, {
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
    });

    // return minimal fields
    const images = response.data.results.map(img => ({
      id: img.id,
      thumb: img.urls.small,
      full: img.urls.full,
      alt: img.alt_description || img.description || term,
      link: img.links.html
    }));

    return res.json({ term, total: response.data.total, images });
  } catch (err) {
    console.error(err.response?.data || err.message || err);
    return res.status(500).json({ message: 'Search failed', detail: err.message });
  }
});

// ----- GET /api/top-searches -----
app.get('/api/top-searches', authMiddleware, async (req, res) => {
  // aggregate top 5 terms
  const top = await Search.aggregate([
    { $group: { _id: '$term', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  res.json(top.map(t => ({ term: t._id, count: t.count })));
});

// ----- GET /api/history -----
app.get('/api/history', authMiddleware, async (req, res) => {
  const records = await Search.find({ userId: req.userId }).sort({ timestamp: -1 }).limit(100);
  res.json(records.map(r => ({ term: r.term, timestamp: r.timestamp })));
});

const port = process.env.PORT || 4081;
app.listen(port, () => console.log(`Server running on ${port}`));
