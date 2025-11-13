//set up
const express = require('express');     //parse JSON
const cors = require('cors');           //allow frontend access
const morgan = require('morgan');       //log request in terminal
const connectDB = require('./src/config/db'); 

const app = express(); //heart of the backend

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to DB
connectDB();


// import routers
const menuCategoriesRouter = require('./src/routes/menuCategories');
const menuItemsRouter = require('./src/routes/menuItems');

// mount routers
app.use('/categories', menuCategoriesRouter);
app.use('/items', menuItemsRouter);



// Basic route
app.get('/', (req, res) => {
  res.send('Restaurant API is running!');
});

module.exports = app;
