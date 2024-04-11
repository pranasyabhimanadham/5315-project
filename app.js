/****************************************************************************** 
ITE5315 – Project 
I declare that this assignment is my own work in accordance with Humber Academic 
Policy. 
No part of this assignment has been copied manually or electronically from any other 
source 
(including web sites) or distributed to other students. 
Name: Sai Pranasya Student ID: N01582877 Date: 07/04/2024
******************************************************************************/
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const { body, validationResult } = require('express-validator');
const db = require('./db'); // Import the db.js file

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize MongoDB connection
db.initialize('mongodb+srv://pranasyabhimanadham:Pranu%4003@saipraanasya.9aodoe1.mongodb.net/5315-project')
  .then(() => {
    console.log('MongoDB connected');
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Set up Handlebars view engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views')); // Set path to views directory

// Middleware to parse incoming request body as JSON
app.use(express.json());

// Route to render searchForm
app.route('/search')
  .get((req, res) => {
    res.render('searchForm.hbs'); // Render searchForm.hbs
  })
  .post(async (req, res) => {
    const { page, perPage, borough } = req.body;

    try {
      const restaurants = await db.getAllRestaurants(page, perPage, borough);
      res.render('searchFormat.hbs', { restaurants }); // Render searchFormat.hbs with restaurant data
    } catch (err) {
      console.error('Error getting restaurants:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Route to add a new restaurant
app.post('/api/restaurants', [
  body('name').notEmpty(),
  body('borough').notEmpty(),
  body('cuisine').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newRestaurant = await db.addNewRestaurant(req.body);
    res.status(201).json(newRestaurant);
  } catch (err) {
    console.error('Error adding new restaurant:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get all restaurants with Handlebars form and results
app.route('/api/restaurants')
  .get(async (req, res) => {
    res.render('restaurants-form'); // Render the form template
  })
  .post(async (req, res) => {
    const { page, perPage, borough } = req.body;

    try {
      const restaurants = await db.getAllRestaurants(page, perPage, borough);
      res.render('restaurants-results', { restaurants }); // Render the results template with data
    } catch (err) {
      console.error('Error getting restaurants:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Route to get a specific restaurant by id
app.get('/api/restaurants/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const restaurant = await db.getRestaurantById(id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (err) {
    console.error('Error getting restaurant by id:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to update a specific restaurant by id
app.put('/api/restaurants/:id', async (req, res) => {
  const { id } = req.params;
  const { body: data } = req;

  try {
    const updatedRestaurant = await db.updateRestaurantById(data, id);
    if (!updatedRestaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json(updatedRestaurant);
  } catch (err) {
    console.error('Error updating restaurant by id:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to delete a specific restaurant by id
app.delete('/api/restaurants/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRestaurant = await db.deleteRestaurantById(id);
    if (!deletedRestaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (err) {
    console.error('Error deleting restaurant by id:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Set static folder for CSS files
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
