const mongoose = require('mongoose');

let Restaurant;

// Function to initialize the database connection and define the Restaurant model
async function initialize(connectionString) {
  await mongoose.connect(connectionString); // Connect to MongoDB
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  console.log('MongoDB connected');

  // Define the schema for the Restaurant model
  const restaurantSchema = new mongoose.Schema({
    name: String,
    borough: String,
    cuisine: String,
    address: {
      building: String,
      coord: [Number],
      zipcode: String,
    },
    grades: [{
      date: Date,
      grade: String,
      score: Number
    }],
    restaurant_id: String
  });

  // Create the Restaurant model
  Restaurant = mongoose.model('Restaurant', restaurantSchema);
}

// Function to add a new restaurant
async function addNewRestaurant(data) {
  return await Restaurant.create(data);
}

// Function to retrieve all restaurants
async function getAllRestaurants(page, perPage, borough) {
  const skip = (page - 1) * perPage;
  let query = {};

  if (borough) {
    query.borough = borough;
  }

  // Query the Restaurant collection, applying pagination and sorting
  const restaurants = await Restaurant.find(query)
    .skip(skip)
    .limit(perPage)
    .sort({ restaurant_id: 1 });

  return restaurants;
}

// Function to retrieve a restaurant by its ID
async function getRestaurantById(id) {
  return await Restaurant.findById(id);
}

async function updateRestaurantById(data, id) {
  try {
    // Create an object containing the update operations
    const updateOps = { $set: data };
    
    // Update the restaurant document using findByIdAndUpdate
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      updateOps,
      { new: true }
    );

    return updatedRestaurant;
  } catch (error) {
    // Handle errors
    console.error('Error updating restaurant by id:', error);
    throw error; // Propagate the error to the caller
  }
}
// Function to delete a restaurant by its ID
async function deleteRestaurantById(id) {
  return await Restaurant.findByIdAndDelete(id);
}

module.exports = {
  initialize,
  addNewRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurantById,
  deleteRestaurantById
};
