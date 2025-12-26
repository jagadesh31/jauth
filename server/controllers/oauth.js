
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
require('dotenv').config();
const userModel = require('../models/user.js');
const verificationLinkModel = require('../models/verificationLink.js');
const credentialsModel = require('../models/credentials.js');
const authorizationCodeModel = require('../models/authorizationCode.js');
const { randomCode, generateAccessToken, generateRefreshToken } = require('../utils/auth');




const getCode = async (req, res) => {
  const { client_id, redirect_uri } = req.query;

  const code = randomCode();

  await authorizationCodeModel.create({
    code,
    clientId: client_id,
    redirectUri: redirect_uri,
    expiresAt: Date.now() + 60_000,
    used: false
  });

  res.json({ code });
};


const getToken = async (req, res) => {
    const { code, client_id, client_secret, redirect_uri } = req.body;
    try {
        // Verify client credentials first
        const client = await credentialsModel.findOne({ 
            clientId: client_id, 
            clientSecret: client_secret 
        });

        
        if (!client) {
            return res.status(401).json({ message: 'Invalid client credentials' });
        }

       if (result.clientId !== client_id) return 401;
       if (result.redirectUri !== redirect_uri) return 401;

        const result = await authorizationCodeModel.findOne({ code });
        if (!result) {
            return res.status(400).json({ message: 'Invalid authorization code' });
        }

        const accessToken = generateAccessToken({ userId: result.userId });
        const refreshToken = generateRefreshToken({ userId: result.userId });
        // Set tokens in httpOnly cookies
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        console.log('Tokens set in cookies for userId:', result.userId);
        res.status(200).json({
            message: 'Tokens set in cookies',
            token_type: 'Bearer',
            expires_in: 900
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUser = async (req, res) => {
    const token = req.cookies['access_token'];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
        const userInfo = await userModel.findById(decoded.userId);
        if (!userInfo) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(userInfo);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        console.error('Error fetching user info:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const authorizeApp = async (req, res) => {
    const { client_id, redirect_uri, response_type, scope } = req.query;

    console.log('OAuth Authorization Request:', {
        client_id,
        redirect_uri, 
        response_type,
        scope
    });

    try {

        const client = await credentialsModel.findOne({ clientId: client_id });

        if (!client) {
            return res.status(400).json({ message: 'Invalid client_id' });
        }


        if (response_type !== 'code') {
            return res.status(400).json({ message: 'Unsupported response_type' });
        }


        const CLIENT_URL = process.env.CLIENT_BASE_URL || 'https://jauth.jagadesh31.tech';
        
        res.redirect(
            `${CLIENT_URL}/redirect?` +
            `client_id=${client_id}&` +
            `redirect_uri=${encodeURIComponent(redirect_uri)}&` +
            `response_type=${response_type}&` +
            `scope=${encodeURIComponent(scope || '')}`
        );

    } catch (err) {
        console.log('OAuth Authorization error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
    getCode,
    getToken,
    getUser,
    authorizeApp
};