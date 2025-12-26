const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');

require('dotenv').config();

let userModel = require('../models/user.js');
const credentialsModel = require('../models/credentials.js');
const { generateAccessToken, generateRefreshToken, randomCode } = require('../utils/auth.js');
const { default: axios } = require('axios');


const loginUser = async (req, res) => {
    try {
        let result = await userModel.findOne({ email: req.body.email });
        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        let enteredPass = req.body.password;
        let isSame = await bcrypt.compare(enteredPass, result.password);

        if (!isSame) {
            return res.status(401).json({ message: 'Incorrect Password' });
        }

        let accessToken = generateAccessToken({ userId: result._id });
        let refreshToken = generateRefreshToken({ userId: result._id });

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
        res.status(200).json({ 
            message: 'Successfully logged in', 
            user: result});

    } catch (err) {
        console.log('error :', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

const registerUser = async (req, res) => {
    console.log(req.body);
    
    try {
        // Check if user already exists
        const existingUser = await userModel.findOne({ 
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        });
        
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email or username' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userData = {
            ...req.body,
            password: hashedPassword
        };

        let result = await userModel.create(userData);
        let accessToken = generateAccessToken({ userId: result._id });
        let refreshToken = generateRefreshToken({ userId: result._id });
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
        res.status(201).json({ 
            message: 'Successfully created', 
            user: result
        });
    } catch (err) {
        console.log('error :', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getUserInfo = async (req, res) => {
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

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('access_token', {  
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'})
        res.status(200).json({ message: 'Successfully logged out' });
        }
        catch(err){
            console.err('Error during logout:', err);
            return res.status(500).json({ message: 'Server error during logout' });
        }
    } 


const getApps = async (req, res) => {
    let { userId } = req.query;
    console.log(userId);
    
    try {
        let result = await credentialsModel.find({ userId: userId });
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

const createCredentials = async (req, res) => {
    let client_id = randomCode();
    let client_secret = randomCode();
    
    try {
        let result = await credentialsModel.create({
            ...req.body,
            clientId: client_id,
            clientSecret: client_secret
        });
        
        console.log(result);
        res.status(201).json(result);
    } catch (err) {
        console.log('Error creating credentials:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateCredentials = async (req, res) => {
    const { id } = req.params;
    const { name, home, callback, scope } = req.body;

    try {
        // Validate URLs
        const isValidUrl = (string) => {
            try {
                new URL(string);
                return true;
            } catch (_) {
                return false;
            }
        };

        if (home && !isValidUrl(home)) {
            return res.status(400).json({ message: 'Invalid homepage URL' });
        }

        if (callback && !isValidUrl(callback)) {
            return res.status(400).json({ message: 'Invalid callback URL' });
        }

        const result = await credentialsModel.findByIdAndUpdate(
            id,
            { 
                name, 
                home, 
                callback, 
                scope, 
                updatedAt: new Date() 
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.status(200).json(result);
    } catch (err) {
        console.error('Error updating credentials:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteCredentials = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await credentialsModel.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.status(200).json({ message: 'Application deleted successfully' });
    } catch (err) {
        console.error('Error deleting credentials:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

const regenerateClientSecret = async (req, res) => {
    const { id } = req.params;
    const newClientSecret = randomCode();

    try {
        const result = await credentialsModel.findByIdAndUpdate(
            id,
            { 
                clientSecret: newClientSecret,
                updatedAt: new Date(),
                lastSecretRegenerated: new Date()
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.status(200).json(result);
    } catch (err) {
        console.error('Error regenerating client secret:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


const jauthLogin = async (req, res) => {
    const code = req.query.code;

    console.log(code)

    if (!code) return res.status(400).send('No code found');

    try {
        // Exchange code for access token with JAuth
        const tokenResponse = await axios.get(`${process.env.JAUTH_BASE_URL}/oauth/getToken`, {
            params: {
                code,
                client_id: process.env.JAUTH_CLIENT_ID, 
                client_secret: process.env.JAUTH_CLIENT_SECRET,
                redirect_uri: `${process.env.SERVER_BASE_URL}/user/jauth/callback`
            }
        });

        const { access_token } = tokenResponse.data;

        console.log('Access Token:', access_token);

        const userResponse = await axios.get(`${process.env.JAUTH_BASE_URL}/oauth/getUser`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        const jauthUser = userResponse.data;
        

        let user = await userModel.findOne({ email: jauthUser.email });
        if (!user) {
            user = await userModel.create({
                email: jauthUser.email,
                username: jauthUser.username,
                name: jauthUser.name,
            });
        }


        const token = generateToken(user._id);
        
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('refresh_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        console.log('JAuth login successful for user:', user.email);
         res.redirect(`${process.env.CLIENT_BASE_URL}/home`);

        // res.redirect(`${process.env.CLIENT_BASE_URL}/home`);
        
    } catch (error) {
        console.error('JAuth callback error:', error);
        res.redirect(`${process.env.client_url}/login?error=jauth_failed`);
    }
};



module.exports = {
    registerUser,
    loginUser,
    getUserInfo,
    getApps,
    createCredentials,
    updateCredentials,
    deleteCredentials,
    regenerateClientSecret,
    logoutUser,
    jauthLogin
};
