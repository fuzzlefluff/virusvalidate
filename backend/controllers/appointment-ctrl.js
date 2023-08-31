const Appointment = require('../models/appointment-model')

createAppointment = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide an appointment',
        })
    }

    const appointment = new Appointment(body)

    if (!appointment) {
        return res.status(400).json({ success: false, error: err })
    }

    appointment
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: appointment._id,
                message: 'Appointment created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Appointment not created!',
            })
        })
}

const updateAppointment = (req, res) => {
  const body = req.body

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a body to update',
    })
  }

  Appointment.findOne({ _id: req.params.id })
    .then(appointment => {
      if (!appointment) {
        return res.status(404).json({
          message: 'Appointment not found!',
        })
      }
      appointment.name = body.name
      appointment.address = body.address
      
      appointment.save()
        .then(() => {
          return res.status(200).json({
            success: true,
            id: appointment._id,
            message: 'Appointment updated!',
          })
        })
        .catch(error => {
          return res.status(404).json({
            error,
            message: 'Appointment not updated!',
          })
        })
    })
    .catch(err => {
      return res.status(404).json({
        err,
        message: 'Appointment not found!',
      })
    })
}

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