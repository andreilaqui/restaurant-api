// libraries
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest : 'uploads/'})

// middleware
const {uploadImage, deleteImage} = require('../services/imageService');
const { auth, requireAdmin } = require('../middleware/auth');

// schema
const MenuItem = require('../models/menuItemModel');

//C-reate
//router.post('/', upload.single('image'), async (req, res) => { //old line before auth
router.post('/', auth, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, slug, description, category, price, availability, tags } = req.body;
    let imageData = null;

    if (req.file) {
      const result = await uploadImage(req.file.path);
      imageData = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

    const item = new MenuItem({
      name,
      slug,
      description,
      category,
      price,
      availability,
      tags,
      image: imageData
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error('Menu item creation error:', err.message);
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
//router.patch('/:id', async (req, res) => {
router.patch('/:id', auth, requireAdmin, async (req, res) => {
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
//router.delete('/:id', async (req, res) => {
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Delete Cloudinary image if present
    if (item.image?.publicId) {
      const result = await deleteImage(item.image.publicId);
      if (result.result !== 'ok') {
        console.warn(`Cloudinary deletion failed for ${item.image.publicId}`);
      }
    }

    await item.deleteOne();

    res.json({ message: 'Menu item and image deleted successfully', deletedItem: item });
  } catch (err) {
    console.error('Error deleting menu item:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;