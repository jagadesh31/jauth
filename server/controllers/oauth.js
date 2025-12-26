const jwt = require('jsonwebtoken');
require('dotenv').config();

const userModel = require('../models/user');
const credentialsModel = require('../models/credentials');
const authorizationCodeModel = require('../models/authorizationCode');
const { randomCode, generateAccessToken, generateRefreshToken } = require('../utils/auth');

/* ======================================================
   AUTHORIZATION CODE ENDPOINT
   (User must already be authenticated via middleware)
====================================================== */
const getCode = async (req, res) => {
  try {
    const { client_id, redirect_uri } = req.query;

    // userId injected by auth middleware
    if (!req.userId) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    // Validate client existence
    const client = await credentialsModel.findOne({ clientId: client_id });
    if (!client) {
      return res.status(400).json({ error: 'invalid_client' });
    }

    // OPTIONAL (commented as requested)
    // if (client.redirectUri !== redirect_uri) {
    //   return res.status(400).json({ error: 'invalid_redirect_uri' });
    // }

    const code = randomCode();

    await authorizationCodeModel.create({
      userId: req.userId,
      clientId: client_id,
      redirectUri: redirect_uri,
      code,
      expiresAt: Date.now() + 60 * 1000, // 1 minute
      used: false
    });

    console.log(`Generated code ${code} for user ${req.userId} and client ${client_id}`);

    return res.status(200).json({ code });

  } catch (err) {
    console.error('getCode error:', err);
    return res.status(500).json({ error: 'server_error' });
  }
};

/* ======================================================
   TOKEN ENDPOINT
====================================================== */
const getToken = async (req, res) => {
  const { code, client_id, client_secret, redirect_uri } = req.body;

  try {
    // Validate client credentials
    const client = await credentialsModel.findOne({
      clientId: client_id,
      clientSecret: client_secret
    });

    if (!client) {
      return res.status(401).json({ error: 'invalid_client' });
    }

    console.log(`Client ${client_id} requesting token with code ${code}`);

    // Validate authorization code
    const authCode = await authorizationCodeModel.findOne({ code });
    if (!authCode) {
      return res.status(400).json({ error: 'invalid_grant' });
    }

    console.log(`Found auth code:`, authCode);

    if (authCode.used) {
      return res.status(400).json({ error: 'authorization_code_used' });
    }

    // OPTIONAL (commented as requested)
    // if (authCode.clientId !== client_id) {
    //   return res.status(400).json({ error: 'invalid_grant' });
    // }

    // OPTIONAL (commented as requested)
    // if (authCode.redirectUri !== redirect_uri) {
    //   return res.status(400).json({ error: 'invalid_grant' });
    // }

    if (authCode.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'authorization_code_expired' });
    }

    // Generate tokens
    const accessToken = generateAccessToken({ userId: authCode.userId });
    const refreshToken = generateRefreshToken({ userId: authCode.userId });

    // Mark code as used (important)
    authCode.used = true;
    await authCode.save();

    return res.status(200).json({
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 900
    });

  } catch (err) {
    console.error('getToken error:', err);
    return res.status(500).json({ error: 'server_error' });
  }
};

/* ======================================================
   USER INFO ENDPOINT (Protected Resource)
====================================================== */
const getUser = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    const userInfo = await userModel.findById(decoded.userId);
    if (!userInfo) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(userInfo);

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.error('getUser error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

/* ======================================================
   AUTHORIZE ENDPOINT
====================================================== */
const authorizeApp = async (req, res) => {
  const { client_id, redirect_uri, response_type, scope } = req.query;

  try {
    const client = await credentialsModel.findOne({ clientId: client_id });
    if (!client) {
      return res.status(400).json({ message: 'Invalid client_id' });
    }

    if (response_type !== 'code') {
      return res.status(400).json({ message: 'Unsupported response_type' });
    }

    const CLIENT_URL =
      process.env.CLIENT_BASE_URL || 'https://jauth.jagadesh31.tech';

    return res.redirect(
      `${CLIENT_URL}/redirect?` +
        `client_id=${client_id}&` +
        `redirect_uri=${encodeURIComponent(redirect_uri)}&` +
        `response_type=${response_type}&` +
        `scope=${encodeURIComponent(scope || '')}`
    );

  } catch (err) {
    console.error('authorizeApp error:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getCode,
  getToken,
  getUser,
  authorizeApp
};
