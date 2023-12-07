// Here we import and define a router that listens for HTML calls
// and directs the information to the correct methods
const express = require('express');

const LocationCtrl = require('../controllers/location-ctrl');

const router = express.Router();

// This is where the mapping happens, where we match a post method to a defined URL with a
// creation method, update method, deletion method, get methods,
// and anything else we could need like a login check
router.post('/location', LocationCtrl.createLocation);
router.put('/location/:id', LocationCtrl.updateLocation);
router.delete('/location/:id', LocationCtrl.deleteLocation);
router.get('/location/:id', LocationCtrl.getLocationById);
router.get('/locations', LocationCtrl.getLocations);

module.exports = router;
