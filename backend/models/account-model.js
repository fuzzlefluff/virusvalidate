//we are telling mongoose the structure of our data and exporting this object for use in our controllers
const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Define the object name here
const Account = new Schema(
    {
        //Define the object properties here
        username: { type: String, required: true },
        password: { type: [String], required: true },
		email: { type: [String], required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Accounts', Account)