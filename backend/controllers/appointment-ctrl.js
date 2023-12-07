/* eslint-disable no-underscore-dangle */
// use the database schema we have defined
const Appointment = require('../models/appointment-model');
// we need a reference to our Accounts, to check for authentication
const Account = require('../models/account-model');

// this method checks if a valid api key was sent with the data.
async function checkAPIkey(req) {
  try {
    const apiKeyReq = req.headers.apikey;
    // eslint-disable-next-line no-console
    console.log(apiKeyReq);

    if (typeof apiKeyReq === 'undefined' || apiKeyReq === null) {
      return false;
    }
    const trimmedApiKey = apiKeyReq.trim();

    const foundAccount = await Account.findOne({ apikey: trimmedApiKey }).exec();

    if (!foundAccount) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

// this method creates an Appointment in the database
// it expects a POST call from the router, the data should be in the json object passed
// it also expects a valid apikey in the header 'apikey'
const createAppointment = async (req, res) => {
  checkAPIkey(req).then((keyValid) => {
    if (!keyValid) {
      return res.status(401).json({ success: false, erorr: 'Unauthorized' });
    }

    const { body } = req;

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
          conditionMet: false, // Set the initial value to false as no one has been validated yet
        })),
      })),
    });

    try {
      const savedAppointment = appointment.save();

      return res.status(201).json({
        success: true,
        id: savedAppointment._id,
        message: 'Appointment created!',
      });
    } catch (error) {
      return res.status(400).json({
        error,
        message: 'Appointment not created!',
      });
    }
  }).catch(() => res.status(500).json({ success: false, error: 'Internal Server Error' }));
};

// this method updates an appointment in the database
// it expects a PUT call from the router, the id should be in the json object passed
const updateAppointment = (req, res) => {
  checkAPIkey(req).then((keyValid) => {
    if (!keyValid) {
      return res.status(401).json({ success: false, erorr: 'Unauthorized' });
    }

    const { body } = req;

    if (!body) {
      return res.status(400).json({
        success: false,
        error: 'You must provide a body to update',
      });
    }

    return Appointment.findOne({ _id: req.params.id })
      .then((appointment) => {
        if (!appointment) {
          return res.status(404).json({
            message: 'Appointment not found!',
          });
        }

        // Assign updated values to Appointment
        const updatedAppointment = {
          location: body.location,
          date: body.date,
          visitors: body.vistors,
        };
        Object.assign(appointment, updatedAppointment);

        return appointment
          .save()
          .then(() => res.status(200).json({
            success: true,
            id: appointment._id,
            message: 'Appointment updated!',
          }))
          .catch((error) => res.status(404).json({
            error,
            message: 'Appointment not updated!',
          }));
      })
      .catch((err) => res.status(404).json({
        err,
        message: 'Appointment not found!',
      }));
  }).catch(() => res.status(500).json({ success: false, error: 'Internal Server Error' }));
};

// this method deletes an appointment from the database
// it expects a DELETE call from the router and an specific id in the URL
const deleteAppointment = (req, res) => {
  checkAPIkey(req).then((keyValid) => {
    if (!keyValid) {
      return res.status(401).json({ success: false, erorr: 'Unauthorized' });
    }
    return Appointment.findOneAndDelete({ _id: req.params.id })
      .then((appointment) => {
        if (!appointment) {
          return res.status(404).json({ success: false, error: 'Appointment not found' });
        }
        return res.status(200).json({ success: true, data: appointment });
      })
      .catch((err) => res.status(400).json({ success: false, error: err }));
  }).catch(() => res.status(500).json({ success: false, error: 'Internal Server Error' }));
};

// this method finds a specific appointment from the database
// it expects a GET call from the router and a specific id in the URL
const getAppointmentById = (req, res) => {
  Appointment.findOne({ _id: req.params.id })
    .then((appointment) => {
      if (!appointment) {
        return res.status(404).json({ success: false, error: 'Appointment not found' });
      }
      return res.status(200).json({ success: true, data: appointment });
    })
    .catch((err) => res.status(400).json({ success: false, error: err }));
};

// this method returns all appointments from the database
// it expects a GET call from the router
const getAppointments = (req, res) => {
  Appointment.find({})
    .then((appointments) => {
      if (!appointments.length) {
        return res.status(404).json({ success: false, error: 'Appointment not found' });
      }
      return res.status(200).json({ success: true, data: appointments });
    })
    .catch((err) => res.status(400).json({ success: false, error: err }));
};

// let our router know what methods it can map to
module.exports = {
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointments,
  getAppointmentById,
};
