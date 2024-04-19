/****************************************************************************** 
ITE5315 – Project 
I declare that this assignment is my own work in accordance with Humber Academic 
Policy. 
No part of this assignment has been copied manually or electronically from any other 
source 
(including web sites) or distributed to other students. 
Name: Sai Pranasya Student ID: N01582877 Date: 07/04/2024
******************************************************************************/
// load mongoose since we need it to define a model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
  address: {
    building: String,
    coord: [Number],
    street: String,
    zipcode: String,
  },
  borough: String,
  cuisine: String,
  grades: [
    {
      date: Date,
      grade: String,
      score: Number,
    },
  ],
  name: String,
  restaurant_id: String,
});

module.exports = mongoose.model("restaurants", restaurantSchema);
