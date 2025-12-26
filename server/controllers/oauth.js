
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
const getToken = async (req, res) => {
  const { code, client_id, client_secret, redirect_uri } = req.body;

  try {
    // 1. Verify client credentials
    const client = await credentialsModel.findOne({
      clientId: client_id,
      clientSecret: client_secret
    });

    if (!client) {
      return res.status(401).json({ error: 'invalid_client' });
    }

    // 2. Verify authorization code
    const result = await authorizationCodeModel.findOne({ code });
    if (!result) {
      return res.status(400).json({ error: 'invalid_grant' });
    }

    // Optional but RECOMMENDED checks
    if (result.clientId !== client_id) {
      return res.status(400).json({ error: 'invalid_grant' });
    }
  //  if (result.redirectUri !== redirect_uri) {
 //     return res.status(400).json({ error: 'invalid_grant' });
  //  }

    // 3. Generate tokens
    const accessToken = generateAccessToken({ userId: result.userId });
    const refreshToken = generateRefreshToken({ userId: result.userId });

    // 4. (Optional) Delete used authorization code
  

    // 5. Return OAuth-compliant JSON response
    return res.status(200).json({
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 15 * 60 // seconds
    });

  } catch (err) {
    console.error('Token error:', err);
    return res.status(500).json({ error: 'server_error' });
  }
};


const getUser = async (req, res) => {
  // 1. Read Authorization header
  const authHeader = req.headers.authorization;

  // 2. Validate header presence
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // 3. Extract token
  const token = authHeader.split(' ')[1];

  try {
    // 4. Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    // 5. Fetch user
    const userInfo = await userModel.findById(decoded.userId);
    if (!userInfo) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 6. Success
    res.status(200).json(userInfo);

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (err.name === 'JsonWebTokenError') {
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
