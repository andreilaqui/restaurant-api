const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// upload image
const uploadImage = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: 'manila-sunrice/menu-items',
    use_filename: true,
    unique_filename: false
  });
};

// delete image by public ID
const deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

module.exports = {
  uploadImage,
  deleteImage
};