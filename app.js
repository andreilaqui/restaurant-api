//set up
const express = require('express');     //parse JSON
const cors = require('cors');           //allow frontend access
const morgan = require('morgan');       //log request in terminal
const { connectDB } = require('./src/config/db');

const app = express(); //heart of the backend

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to DB - Vercel uses serverless function so I need to make sure there is a connection (this was a big pain)
connectDB();


// import routers
const menuCategoriesRouter = require('./src/routes/menuCategories');
const menuItemsRouter = require('./src/routes/menuItems');
const reservationRouter = require('./src/routes/reservations')

// mount routers
app.use('/menucategories', menuCategoriesRouter);
app.use('/menuitems', menuItemsRouter);
app.use('/reservations', reservationRouter);



// Basic route
app.get('/', (req, res) => {
  res.send('Restaurant API is running!');
});

module.exports = app;
