//we are telling mongoose the structure of our data and exporting this object for use in our controllers
const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Define the object name here
const Condition = new Schema(
    {
        //Define the object properties here
        name: { type: String, required: true },
        description: { type: [String], required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Conditions', Condition)