const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // temp storage
const { uploadImage, deleteImage } = require('../services/imageService');

// upload image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const result = await uploadImage(req.file.path);
    res.status(201).json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error('Image upload error:', err.message);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// delete image by public_id
router.delete('/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await deleteImage(publicId);
    if (result.result === 'ok') {
      res.status(200).json({ message: 'Image deleted successfully' });
    } else {
      res.status(400).json({ message: 'Failed to delete image' });
    }
  } catch (err) {
    console.error('Image deletion error:', err.message);
    res.status(500).json({ message: 'Server error during deletion' });
  }
});

module.exports = router;