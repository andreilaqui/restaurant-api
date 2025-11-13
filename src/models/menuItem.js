const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuCategory', required: true },
  price: { type: Number, required: true },
  image: String,
  availability: { type: Boolean, default: true }
  
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);