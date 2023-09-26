// we are using MongoDB to store our data, mongoose is the library in javascript that interfaces with the database
const mongoose = require('mongoose')

// we create a connection to the database, or return an error if we can't connect for some reason.
mongoose
    .connect('mongodb://127.0.0.1/VirusValidate', { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

// let our classes know they can access the database with the db object.
const db = mongoose.connection

module.exports = db