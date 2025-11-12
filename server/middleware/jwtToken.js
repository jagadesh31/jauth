const jwt = require('jsonwebtoken');

function verifyAccessToken(req, res, next) {
  const token = req.headers['authorization'].split(' ')[1]; 
console.log('tomen')
  if (!token) return res.status(401); 

  jwt.verify(token, process.env.ACCESS_SECRET, (err, userId) => {
    if (err) return res.status(403); 
    req.userId = userId; 
    next();
  });
}


module.exports = {verifyAccessToken};