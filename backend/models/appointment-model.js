const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Condition = new Schema(
    {
        condition: { type: String, required: true },
        conditionMet: { type: Boolean, required: true },
    }
)

const Visitor = new Schema(
    {
        visitor: { type: String, required: true },
        conditions: { type: [Condition], required: true },
    }
)

const Appointment = new Schema(
    {
        visitors: [
            {
                visitor: String,
                conditions: [
                    {
                        condition: String,
                        conditionMet: Boolean
                    }
                ]
            }
        ],
        location: String,
        date: String
    },
    { timestamps: true }
);


module.exports = mongoose.model('Appointments', Appointment)