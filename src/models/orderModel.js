const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [
    {
      itemId: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ],
  total: { type: Number, required: true }, // calculated client-side for simplicity
  orderType: {
    type: String,
    enum: ['pickup', 'delivery'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending'
  },
  adminNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);