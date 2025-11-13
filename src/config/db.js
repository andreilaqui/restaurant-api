const mongoose = require('mongoose');   // wrapper around MongoDB - so I can use schema, models, helpers
let isConnected;

async function connectDB() {
  
  // use existing and be done with it
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }
  
  // connect
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = db.connections[0].readyState;
    console.log('Connected to MongoDB with Mongoose');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
}

module.exports =  { connectDB } ;