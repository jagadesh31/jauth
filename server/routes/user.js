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
    jauthLogin,
    toggleCredentialsStatus,
    getJauthUserInfo,
    getApp
} = require('../controllers/user');
const { verifyAccessToken } = require('../middleware/verify');


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/jauth/callback', jauthLogin);
router.get('/logout',logoutUser);


router.get('/getApp', getApp);
router.get('/jauthUserInfo', getJauthUserInfo);

// Protected routes
router.get('/userInfo', verifyAccessToken, getUserInfo);


router.get('/getApps', verifyAccessToken, getApps);

router.post('/credentials/create', verifyAccessToken, createCredentials);
router.put('/credentials/:id', verifyAccessToken, updateCredentials);
router.delete('/credentials/:id', verifyAccessToken, deleteCredentials);
router.post('/credentials/:id/regenerate-secret', verifyAccessToken, regenerateClientSecret);

router.patch('/credentials/:id/toggle-status', verifyAccessToken, toggleCredentialsStatus);

module.exports = router;