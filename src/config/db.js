const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(); // uses the default DB from URI
    console.log('Connected to MongoDB');
  }
  return db;
}

module.exports = { connectDB };
