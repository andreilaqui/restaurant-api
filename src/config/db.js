const mongoose = require('mongoose');   // wrapper around MongoDB - so I can use schema, models, helpers

async function connectDB() {
  console.log(process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB with Mongoose');
  } catch (err) {
    
    console.error('MongoDB connection error! Error message:', err);
    process.exit(1);
  }
}

module.exports = { connectDB };