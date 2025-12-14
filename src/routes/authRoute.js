// libraries
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
//schema
const User = require('../models/userModel');
//helpers
const { generateAccessToken, generateRefreshToken, issueTokens } = require('../utils/auth');


// C-reate / signup
router.post(
  "/signup",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password")
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
      .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
      .matches(/[0-9]/).withMessage("Password must contain at least one number")
      .matches(/[^A-Za-z0-9]/).withMessage("Password must contain at least one special character"),
    body("email").optional({ nullable: true, checkFalsy: true }).isEmail().withMessage("Invalid email address"),
    body("phone").optional({ nullable: true, checkFalsy: true }).isMobilePhone().withMessage("Invalid phone number")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, email, phone, role } = req.body;

    try {
      const user = new User({ username, password, email, phone, role });
      await user.save();

      const tokens = issueTokens(user);

      res.status(201).json(tokens);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);


// login - this is not CRUD Create but using post to send sensitive data (password))
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // 🔑 Issue tokens
    const tokens = issueTokens(user);

    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
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