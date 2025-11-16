const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');

//C-reate
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Error creating order:', err.message);
    res.status(400).json({ message: 'Invalid order data' });
  }
});

//R-ead specific ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

//R-ead according to filters
router.get('/', async (req, res) => {
  try {
    const { orderType, status, startTime, endTime } = req.query;

    const filter = {};

    if (orderType) filter.orderType = orderType;
    if (status) filter.status = status;

    if (startTime || endTime) {
      filter.createdAt = {};
      if (startTime) filter.createdAt.$gte = new Date(startTime);
      if (endTime) filter.createdAt.$lte = new Date(endTime);
    }

    const orders = await Order.find(filter);
    res.json(orders);
  } catch (err) {
    console.error('Error fetching filtered orders:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


//U-pdate
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Order not found' });
    res.json(updated);
  } catch (err) {
    console.error('Error updating order:', err.message);
    res.status(400).json({ message: 'Invalid update data' });
  }
});

//D-elete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    console.error('Error deleting order:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;