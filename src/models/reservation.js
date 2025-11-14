const { Int32 } = require('mongodb');
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    datetime: { type: Date, required: true },
    partySize: { type: Number, required: true, min: 1 },
    notes: String,
    eventType: {
        type: String,
        enum: ["none", "birthday", "anniversary", "business"],
        default: none
    }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);