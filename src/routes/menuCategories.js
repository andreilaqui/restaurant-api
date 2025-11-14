const express = require('express');
const router = express.Router();
const MenuCategory = require('../models/menuCategory');
const MenuItem = require('../models/menuItem'); // because I want to check if any item is using a category before it's deleted

//C-reate
router.post('/', async (req, res) => {
  try {
    const category = new MenuCategory(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(499).json({ error: err.message });
  }
});

//R-ead
router.get('/', async (req, res) => {
  try {
    const categories = await MenuCategory.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//U-pdate
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCategory = await MenuCategory.findByIdAndUpdate(
      id,
      { $set: req.body },   // only update provided fields
      { new: true, runValidators: true }
    );

    if (!updatedCategory) 
      return res.status(404).json({ message: 'Menu category not found' });

    res.json(updatedCategory);

  } catch (err) {
    console.error('Error updating category:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

//D-elete
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // First, check if any menu items reference this category
    const itemsUsingCategory = await MenuItem.find({ category: id });
    if (itemsUsingCategory.length > 0) {
      return res.status(400).json({
        message: 'Cannot delete category: items still reference it',
        count: itemsUsingCategory.length
      });
    }

    const deletedCategory = await MenuCategory.findByIdAndDelete(id);

    if (!deletedCategory)
      return res.status(404).json({ message: 'Menu category not found' });

    res.json({ message: 'Category deleted successfully', deletedCategory });

  } catch (err) {
    console.error('Error deleting category:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;