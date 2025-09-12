const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({ message: 'Authorization header missing' });
  const parts = authHeader.split(' ');
  if(parts.length !== 2) return res.status(401).json({ message: 'Invalid Authorization header format' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, config.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
