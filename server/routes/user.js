const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    getUserInfo,
    logoutUser,
    getApps,
    createCredentials,
    updateCredentials,
    deleteCredentials,
    regenerateClientSecret,
    jauthLogin
} = require('../controllers/user');
const { verifyAccessToken } = require('../middleware/verify');


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/jauth/callback', jauthLogin);
router.get('/logout',logoutUser);

// Protected routes
router.get('/userInfo', verifyAccessToken, getUserInfo);
router.get('/getApps', verifyAccessToken, getApps);
router.post('/credentials/create', verifyAccessToken, createCredentials);
router.put('/credentials/:id', verifyAccessToken, updateCredentials);
router.delete('/credentials/:id', verifyAccessToken, deleteCredentials);
router.post('/credentials/:id/regenerate-secret', verifyAccessToken, regenerateClientSecret);


module.exports = router;