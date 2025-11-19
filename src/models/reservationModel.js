const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    datetime: { type: Date, required: true },
    partySize: { type: Number, required: true, min: 1 },
    notes: String,
    eventType: {
      type: String,
      enum: ["none", "birthday", "anniversary", "business"],
      default: "none"
    },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'],
      default: 'pending'
    }

}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);