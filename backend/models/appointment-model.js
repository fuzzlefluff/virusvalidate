const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Appointment = new Schema(
    {
        visitors: { type: [String], required: true },
        conditions: { type: [String], required: true },
		location: { type: [String], required: true },
		date: { type: String, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('Appointments', Appointment)