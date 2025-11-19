// libraries
const express = require('express');
const router = express.Router();

// middleware
const { auth, requireAdmin } = require('../middleware/auth');

// schemas
const Order = require('../models/orderModel');
const MenuItem = require('../models/menuItemModel'); // needed for snapshot

// C-reate
router.post('/', auth, async (req, res) => {
  try {
    if (!req.body.items || req.body.items.length === 0) {
      return res.status(400).json({ error: "Order must contain at least one item" });
    }

    // Build items with snapshot data
    const itemsWithSnapshots = await Promise.all(
      req.body.items.map(async (item) => {
        const menuItem = await MenuItem.findById(item.itemId).populate('category', 'name slug');
        if (!menuItem) throw new Error(`MenuItem not found: ${item.itemId}`);
        if (!menuItem.availability) throw new Error(`MenuItem not available: ${menuItem.name}`);

        return {
          itemId: menuItem._id,
          quantity: item.quantity,
          snapshot: {
            name: menuItem.name,
            price: menuItem.price,
            category: menuItem.category?.name || null, // store category name
            image: menuItem.image?.url || null
          }
        };
      })
    );

    const newOrder = new Order({
      customerId: req.user.id,
      items: itemsWithSnapshots,
      total: req.body.total, // still client-side calculated
      orderType: req.body.orderType,
      status: req.body.status || 'pending',
      adminNotes: req.body.adminNotes
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Error creating order:', err.message);
    res.status(400).json({ message: 'Invalid order data' });
  }
});

// R-ead all orders for logged-in user
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// R-ead specific ID
router.get('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// R-ead according to filters
router.get('/', auth, requireAdmin, async (req, res) => {
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

// U-pdate
router.patch('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Order not found' });
    res.json(updated);
  } catch (err) {
    console.error('Error updating order:', err.message);
    res.status(400).json({ message: 'Invalid update data' });
  }
});

// D-elete
router.delete('/:id', auth, requireAdmin, async (req, res) => {
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