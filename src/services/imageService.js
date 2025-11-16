const cloudinary = require('cloudinary').v2;
const fs = require('fs'); //file system for cleaning up /uploads

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// upload image
const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'manila-sunrice/menu-items',
      use_filename: true,
      unique_filename: false
    });
    return result;
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Temp file cleanup failed:', err.message);
    });
  }
};

// delete image by public ID
const deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

module.exports = {
  uploadImage,
  deleteImage
};