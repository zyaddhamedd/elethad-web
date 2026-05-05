const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    
    // Verify token
    const decoded = jwt.verify(token, secret);
    
    // Role-based authorization
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }

    // Attach decoded user to request
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
}

module.exports = verifyToken;
