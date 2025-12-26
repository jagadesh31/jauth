const express = require('express');
const router = express.Router();
const {
	getCode,
	getToken,
	getUser,
	authorizeApp
} = require('../controllers/oauth');
const { verifyAccessToken } = require('../middleware/verify');
// OAuth flows
router.get('/getCode',verifyAccessToken, getCode);
router.post('/getToken', getToken);
router.get('/getUser', getUser);
router.get('/authorize', authorizeApp);

module.exports = router;
