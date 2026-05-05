const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');

// Rate limiting for the login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per `window` (here, per 15 minutes)
  message: { error: 'Too many login attempts from this IP, please try again after 15 minutes' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const { pool } = require('../db');

router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM admin_users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET;
    
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    const token = jwt.sign(payload, secret, { expiresIn: '8h' });

    res.json({ token, user: payload });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
