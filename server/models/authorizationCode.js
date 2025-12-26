const mongoose = require('mongoose');

const authorizationCodeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  clientId: {
    type: String,
    required: true
  },
  redirectUri: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  used: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AuthorizationCode', authorizationCodeSchema);
