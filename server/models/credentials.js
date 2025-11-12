const mongoose = require('mongoose');

var credentialsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true,
        unique: true
    },
    clientSecret: {
        type: String,
        required: true
    },
    grant_type: {
        type: String,
        default: 'authorization_code'
    },
    callback: {
        type: String,
        required: true
    },
    home: {
        type: String,
        required: true
    },
    scope: {
        type: String,
        default: 'all-credentials'
    }
}, { 
    timestamps: true,
    strict: false 
});

let credentialsModel = mongoose.model('credentials', credentialsSchema);

module.exports = credentialsModel;