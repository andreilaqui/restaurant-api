// libraries
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
//schema
const User = require('../models/userModel');


// C-reate / signup
router.post(
  '/signup',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number')
      .matches(/[^A-Za-z0-9]/)
      .withMessage('Password must contain at least one special character'),
    body('email').isEmail().withMessage('Invalid email address').optional({ nullable: true, checkFalsy: true }),
    body('phone').isMobilePhone().withMessage('Invalid phone number').optional({ nullable: true, checkFalsy: true })
  ],

  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() }); }

    const { username, password, email, phone, role } = req.body;

    try {
      const user = new User({ username, password, email, phone, role });
      await user.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

// login - this is not CRUD Create but using post to send sensitive data (password))
// router.post('/login', async (req, res) => {
//   try {
//     console.log('Login request body:', req.body);

//     const { username, password } = req.body;
//     const user = await User.findOne({ username });

//     if (!user) {
//       console.log('User not found');
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }


//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).json({ error: 'Invalid username or password' });
//     }

//     // Access token (short-lived)
//     const accessToken = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '30m' }
//     );

//     // Refresh token (longer-lived)
//     const refreshToken = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_REFRESH_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.json({
//       accessToken,
//       refreshToken,
//       user: { id: user._id, username: user.username, role: user.role }
//     });
//   } catch (err) {
//     res.status(500).json({ error: 'Login failed' });
//   }
// });
router.post('/login', async (req, res) => {
  try {
    console.log('Login request body:', req.body);

    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    console.log('Tokens generated successfully');
    res.status(200).json({ accessToken, refreshToken });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error during login' });
  }
});


// Token refresh, also using POST because of sensitive data
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token provided' });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Issue new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});

// logout
router.post('/logout', (req, res) => {
  // If using cookies, clear it
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});


module.exports = router;