//libraries
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image from buffer 
const uploadImage = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'manila-sunrice/menu-items',
        use_filename: true,
        unique_filename: false
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // Convert buffer into a readable stream and pipe to Cloudinary
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null); // end of stream
    readable.pipe(uploadStream);
  });
};

// Delete image by public ID
const deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

module.exports = {
  uploadImage,
  deleteImage
};