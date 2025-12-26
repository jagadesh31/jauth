const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    verified:{
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true,
    strict: false 
});

let userModel = mongoose.model('users', userSchema);

module.exports = userModel;