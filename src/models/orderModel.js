const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
      },
      quantity: { type: Number, required: true, min: 1 },
      snapshot: {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String }, // store category name at time of order
        image: { type: String }     // store image url for customer-facing views
      }
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