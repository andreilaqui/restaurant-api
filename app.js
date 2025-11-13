const express = require('express');     //parse JSON
const cors = require('cors');           //allow frontend access
const morgan = require('morgan');       //log request in terminal

const app = express(); //heart of the backend

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Basic route
app.get('/', (req, res) => {
  res.send('Restaurant API is running!');
});

module.exports = app;
