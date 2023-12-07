// Here we import and define a router that listens for HTML calls
// and directs the information to the correct methods
const express = require('express');

const AppointmentCtrl = require('../controllers/appointment-ctrl');

const router = express.Router();

// This is where the mapping happens, where we match a post method to a defined URL with
// a creation method, update method, deletion method, get methods,
// and anything else we could need like a login check
router.post('/appointment', AppointmentCtrl.createAppointment);
router.put('/appointment/:id', AppointmentCtrl.updateAppointment);
router.delete('/appointment/:id', AppointmentCtrl.deleteAppointment);
router.get('/appointment/:id', AppointmentCtrl.getAppointmentById);
router.get('/appointments', AppointmentCtrl.getAppointments);

module.exports = router;
