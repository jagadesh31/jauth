const jwt = require('jsonwebtoken');

function verifyAccessToken(req, res, next) {
  const token = req.cookies['access_token'];
  console.log('Verifying access token:', token);
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

function verifyRefreshToken(req, res, next) {
  const token = req.cookies['refresh_token'];
  if (!token) return res.status(401).json({ message: 'No token provided' }); 

  jwt.verify(token, process.env.REFRESH_SECRET, (err, userId) => {
    if (err) return res.status(403).json({ message: 'Invalid token' }); 
    req.userId = userId; 
    next();
  });
}


module.exports = {verifyAccessToken};