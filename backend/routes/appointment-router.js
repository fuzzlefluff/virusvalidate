const express = require('express')

const AppointmentCtrl = require('../controllers/appointment-ctrl')

const router = express.Router()

router.post('/appointment', AppointmentCtrl.createAppointment)
router.put('/appointment/:id', AppointmentCtrl.updateAppointment)
router.delete('/appointment/:id', AppointmentCtrl.deleteAppointment)
router.get('/appointment/:id', AppointmentCtrl.getAppointmentById)
router.get('/appointments', AppointmentCtrl.getAppointments)

module.exports = router