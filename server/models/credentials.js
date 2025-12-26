const mongoose = require('mongoose');

var credentialsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    appName: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    clientSecret: {
        type: String,
        required: true
    },
    originUrls : {
        type: [String],
        required: true
    },
    redirectUrls: {
        type: [String],
        required: true
    },
   allowedScopes: {
    type: [String],
    default: ['profile', 'email']
   },
     isActive: {
    type: Boolean,
    default: true
  }
}, { 
    timestamps: true,
    strict: false 
});

let credentialsModel = mongoose.model('credentials', credentialsSchema);

module.exports = credentialsModel;