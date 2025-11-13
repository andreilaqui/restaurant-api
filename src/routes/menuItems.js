const express = require('express');
const router = express.Router();
const MenuItem = require('../models/menuItem');

router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find().populate('category');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.status(201).json(item);
  }catch(err){
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;