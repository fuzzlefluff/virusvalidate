//use the database schema we have defined
const Appointment = require('../models/appointment-model')

// this method creates an Appointment in the database
// it expects a POST call from the router, the data should be in the json object passed
const createAppointment = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide an appointment',
        });
    }

    const appointment = new Appointment({
        location: body.location,
        date: body.date,
        visitors: body.visitorsConditions.map((visitorCondition) => ({
            visitor: visitorCondition.visitor,
            conditions: visitorCondition.conditions.map((conditionId) => ({
                condition: conditionId,
                conditionMet: false  // Set the initial value to false as no one has been validated yet
            })),
        })),
    });

    try {
        const savedAppointment = await appointment.save();

        return res.status(201).json({
            success: true,
            id: savedAppointment._id,
            message: 'Appointment created!',
        });
    } catch (error) {
        console.log("appointment not saved!");
        return res.status(400).json({
            error,
            message: 'Appointment not created!',
        });
    }
};

// this method updates an appointment in the database
// it expects a PUT call from the router, the id should be in the json object passed
const updateAppointment = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        });
    }

    Appointment.findOne({ _id: req.params.id })
        .then((appointment) => {
            if (!appointment) {
                return res.status(404).json({
                    message: 'Appointment not found!',
                });
            }

            // Update appointment data here
            appointment.location = body.location;
            appointment.date = body.date;
            appointment.visitors = body.visitors;

            appointment
                .save()
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        id: appointment._id,
                        message: 'Appointment updated!',
                    });
                })
                .catch((error) => {
                    return res.status(404).json({
                        error,
                        message: 'Appointment not updated!',
                    });
                });
        })
        .catch((err) => {
            return res.status(404).json({
                err,
                message: 'Appointment not found!',
            });
        });
};

// this method deletes an appointment from the database
// it expects a DELETE call from the router and an specific id in the URL
const deleteAppointment = (req, res) => {
    Appointment.findOneAndDelete({ _id: req.params.id })
        .then(appointment => {
            if (!appointment) {
                return res.status(404).json({ success: false, error: `Appointment not found` })
            }
            return res.status(200).json({ success: true, data: appointment })
        })
        .catch(err => {
            return res.status(400).json({ success: false, error: err })
        })
}

// this method finds a specific appointment from the database
// it expects a GET call from the router and a specific id in the URL
const getAppointmentById = (req, res) => {
    Appointment.findOne({ _id: req.params.id })
        .then(appointment => {
            if (!appointment) {
                return res.status(404).json({ success: false, error: `Appointment not found` })
            }
            return res.status(200).json({ success: true, data: appointment })
        })
        .catch(err => {
            return res.status(400).json({ success: false, error: err })
        })
}

// this method returns all appointments from the database
// it expects a GET call from the router
const getAppointments = (req, res) => {
    Appointment.find({})
        .then(appointments => {
            if (!appointments.length) {
                return res.status(404).json({ success: false, error: `Appointment not found` })
            }
            return res.status(200).json({ success: true, data: appointments })
        })
        .catch(err => {
            return res.status(400).json({ success: false, error: err })
        })
}

// let our router know what methods it can map to
module.exports = {
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointments,
    getAppointmentById,
}