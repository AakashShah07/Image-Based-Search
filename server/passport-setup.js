const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./models/User');
require('dotenv').config();

function upsertOAuthUser(profile, provider, cb) {
  User.findOneAndUpdate(
    { oauthId: profile.id, provider },
    {
      oauthId: profile.id,
      provider,
      name: profile.displayName || profile.username,
      email: (profile.emails && profile.emails[0] && profile.emails[0].value) || '',
      avatar: profile.photos && profile.photos[0] && profile.photos[0].value
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).then(user => cb(null, user)).catch(err => cb(err));
}

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, cb) => {
  upsertOAuthUser(profile, 'google', cb);
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
  scope: ['user:email']
}, (accessToken, refreshToken, profile, cb) => {
  upsertOAuthUser(profile, 'github', cb);
}));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['id', 'displayName', 'photos', 'email']
}, (accessToken, refreshToken, profile, cb) => {
  upsertOAuthUser(profile, 'facebook', cb);
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id).then(u => done(null, u)).catch(err => done(err));
});

module.exports = passport;
