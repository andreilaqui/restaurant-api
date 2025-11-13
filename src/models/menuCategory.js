const mongoose = require('mongoose');

const menuCategorySchema = new mongoose.Schema({
  label: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('MenuCategory', menuCategorySchema);