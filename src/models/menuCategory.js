const mongoose = require('mongoose');

const menuCategorySchema = new mongoose.Schema(
  {
    code: { type: String, required: true, trim: true, unique: true }, // e.g., "rice"
    label: { type: String, required: true, trim: true, unique: true }  // eg. "All-Day Silog Plates"
  },
  { timestamps: true }
);



module.exports = mongoose.model('MenuCategory', menuCategorySchema);