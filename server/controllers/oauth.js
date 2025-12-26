const jwt = require('jsonwebtoken');
require('dotenv').config();

const userModel = require('../models/user');
const credentialsModel = require('../models/credentials');
const authorizationCodeModel = require('../models/authorizationCode');
const { randomCode, generateAccessToken, generateRefreshToken } = require('../utils/auth');


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

const getCode = async (req, res) => {
  try {
    const { client_id, redirect_uri ,scope} = req.query;

    const code = randomCode();

    await authorizationCodeModel.create({
      userId: req.userId,
      clientId: client_id,
      redirectUri: redirect_uri,
      scope,
      code,
      expiresAt: Date.now() + 60 * 1000, // 1 minute
      used: false
    });

    return res.status(200).json({ code });

  } catch (err) {
    console.error('getCode error:', err);
    return res.status(500).json({ error: 'server_error' });
  }
};


const getToken = async (req, res) => {
  const { code, client_id, client_secret, redirect_uri } = req.body;

  try {

    console.log(`Received token request with code: ${code}, client_id: ${client_id}, redirect_uri: ${redirect_uri}`);

    const client = await credentialsModel.findOne({clientId: client_id});

    if (!client) {
      return res.status(401).json({ error: 'invalid_client' });
    }



    const result = await authorizationCodeModel.findOne({ code });
    if (!result) {
      return res.status(400).json({ error: 'invalid_grant' });
    }

    console.log(`Found authorization code:`, result);

 
    if (result.used) {
      return res.status(400).json({ error: 'authorization_code_used' });
    }

 


    if (result.clientId !== client_id) {
      return res.status(400).json({ error: 'client_id_mismatch' });
    }

 

    if (result.redirectUri !== redirect_uri) {
      return res.status(400).json({ error: 'redirect_uri_mismatch' });
    }



    if (result.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'authorization_code_expired' });
    }



    const accessToken = generateAccessToken({ userId: result.userId });
    const refreshToken = generateRefreshToken({ userId: result.userId });

   
    result.used = true;
    await result.save();

    return res.status(200).json({
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
    });

  } catch (err) {
    console.error('getToken error:', err);
    return res.status(500).json({ error: 'server_error' });
  }
};


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




module.exports = {
  getCode,
  getToken,
  getUser,
  authorizeApp
};
