//libraries
const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservationModel');

//middleware
const { auth, requireAdmin } = require('../middleware/auth');


//C-reate
router.post('/', auth, async (req, res) => {
  try {
    const { datetime } = req.body;

    // duplicate prevention
    const existing = await Reservation.findOne({
      customerId: req.user.id,
      datetime
    });
    if (existing) {
      return res.status(400).json({ error: "You already have a reservation at this time" });
    }

    const newReservation = new Reservation({
      ...req.body,
      customerId: req.user.id
    });
    const savedReservation = await newReservation.save();
    res.status(201).json(savedReservation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//R-ead reservations for logged-in user
router.get('/my', auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({ customerId: req.user.id });

    if (!reservations)
      return res.status(404).json({ message: 'Reservation not found' });

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//R-ead specific ID
router.get('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)

    if (!reservation)
      return res.status(404).json({ message: 'Reservation not found' });

    res.json(reservation);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//R-ead according to filters
router.get('/', auth, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate, eventType, status } = req.query;
    const filter = {};

    // Date range filter
    if (startDate && endDate) {
      filter.datetime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      filter.datetime = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.datetime = { $lte: new Date(endDate) };
    }

    // Event type filter (single or multiple)
    if (eventType) {
      const types = Array.isArray(eventType) ? eventType : eventType.split(',');
      filter.eventType = { $in: types };
    }

    // Status filter (optional, but useful for admin dashboards)
    if (status) filter.status = status;

    const reservations = await Reservation.find(filter);
    res.json(reservations);
  } catch (err) {
    console.error('Error fetching reservations:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});




//U-pdate
//router.patch('/:id', async (req, res) => {
router.patch('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      { $set: req.body },   // only update provided fields
      { new: true, runValidators: true }
    );

    if (!updatedReservation)
      return res.status(404).json({ message: 'Reservation not found' });

    res.json(updatedReservation);

  } catch (err) {
    console.error('Error updating reservation:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

//D-elete
//router.delete('/:id', async (req, res) => {
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedReservation = await Reservation.findByIdAndDelete(id);

    if (!deletedReservation)
      return res.status(404).json({ message: 'Reservation not found' });

    res.json({ message: 'Reservation deleted successfully', deletedReservation });

  } catch (err) {
    console.error('Error deleting reservation:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;