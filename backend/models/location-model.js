// we are telling mongoose the structure of our data
// and exporting this object for use in our controllers
const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define the object name here
const Location = new Schema(
  {
    // Define the object properties here
    name: { type: String, required: true },
    address: { type: [String], required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Locations', Location);
