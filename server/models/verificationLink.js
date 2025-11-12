const mongoose = require('mongoose');

var verificationLinkSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, { 
    timestamps: true 
});

let verificationLinkModel = mongoose.model('verificationLink', verificationLinkSchema);

module.exports = verificationLinkModel;