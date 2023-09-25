const Appointment = require('../models/appointment-model')

// Create an appointment
const createAppointment = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide an appointment',
        });
    }
	
	console.log("Entire req.body:");
    console.log(req.body);

    const appointment = new Appointment({
    location: body.location,
    date: body.date,
    visitors: body.visitorsConditions.map((visitorCondition) => ({
        visitor: visitorCondition.visitor,
        conditions: visitorCondition.conditions.map((conditionId) => ({
            condition: conditionId,
            conditionMet: false  // Set the initial value as needed
			})),
		})),
	});
	console.log ("\n\nappointment object created: \n")
	console.log(appointment);
    try {
        const savedAppointment = await appointment.save();
		console.log("appointment saved");
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

// Update an appointment
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
            appointment.visitorsConditions = body.visitorsConditions;
            appointment.location = body.location;
            appointment.date = body.date;

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

module.exports = {
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointments,
    getAppointmentById,
}