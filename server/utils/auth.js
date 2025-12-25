const jwt = require('jsonwebtoken');
const crypto = require('crypto');



const randomCode = () => {
    return crypto.randomBytes(32).toString('hex');
};

const generateAccessToken = (payload) => {
    let options = {
        expiresIn: '15m'
    };
    let token = jwt.sign(payload, process.env.ACCESS_SECRET, options);
    return token;
};

const generateRefreshToken = (payload) => {
    let options = {
        expiresIn: '7d'
    };
    let token = jwt.sign(payload, process.env.REFRESH_SECRET, options);
    return token;
};


module.exports = {    randomCode,
    generateAccessToken,
    generateRefreshToken
};