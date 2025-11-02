const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  oauthId: { type: String, required: true, index: true },
  provider: { type: String, required: true },
  name: String,
  email: String,
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
