// we are telling mongoose the structure of our data
// and exporting this object for use in our controllers
const mongoose = require('mongoose');

const { Schema } = mongoose;

// Appointments are unique, and so a quick solution
// is to define that we will have Conditions and Visitors as their own sets of data

// Define a condition that will stored the condition ID
// and a boolean that it has been validated or not
const Condition = new Schema(
  {
    condition: { type: String, required: true },
    conditionMet: { type: Boolean, required: true },
  },
);

// Define a visitor id that will be stored and an array of conditions assigned to it
// eslint-disable-next-line no-unused-vars
const Visitor = new Schema(
  {
    visitor: { type: String, required: true },
    conditions: { type: [Condition], required: true },
  },
);

// Define the object name here
const Appointment = new Schema(
  {
    // Define the object properties here

    // We define the array of visitors with their own arrays of conditions
    visitors: [
      {
        visitor: String,
        conditions: [
          {
            condition: String,
            conditionMet: Boolean,
          },
        ],
      },
    ],

    // These are the traditional properties
    location: String,
    date: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model('Appointments', Appointment);
