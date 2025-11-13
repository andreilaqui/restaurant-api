const mongoose = require('mongoose');   // wrapper around MongoDB - so I can use schema, models, helpers

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB with Mongoose');
  } catch (err) {
    console.log(process.env.MONGODB_URI);
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

module.exports = { connectDB };