// libraries
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
//schema
const User = require('../models/userModel');


// C-reate / signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password, email, phone, role } = req.body;
    const user = new User({ username, password, email, phone, role });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// login - this is not CRUD Create but using post to send sensitive data (password))
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;