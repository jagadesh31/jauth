const mongoose = require('mongoose');

var authorizationCodeSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  code: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
}, { strict: false });

let authorizationCodeModel = mongoose.model('authorizationCode', authorizationCodeSchema);

module.exports = authorizationCodeModel;
