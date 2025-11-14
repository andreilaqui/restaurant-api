const express = require('express');
const router = express.Router();
const MenuItem = require('../models/menuItem');

//C-reate
router.post('/', async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//R-ead
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find().populate('category');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//U-pdate
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Apply only the fields provided in req.body
    const updatedItem = await MenuItem.findByIdAndUpdate(
      id,
      { $set: req.body },   // only update the fields sent
      { new: true, runValidators: true } // return updated doc, enforce schema rules
    );

    if (!updatedItem)
      return res.status(404).json({ message: 'Menu item not found' });

    res.json(updatedItem);

  } catch (err) {
    console.error('Error updating menu item:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

//D-elete
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await MenuItem.findByIdAndDelete(id);

    if (!deletedItem)
      return res.status(404).json({ message: 'Menu item not found' });

    res.json({ message: 'Menu item deleted successfully', deletedItem });

  } catch (err) {
    console.error('Error deleting menu item:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;