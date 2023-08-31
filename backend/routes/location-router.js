const express = require('express')

const LocationCtrl = require('../controllers/location-ctrl')

const router = express.Router()

router.post('/location', LocationCtrl.createLocation)
router.put('/location/:id', LocationCtrl.updateLocation)
router.delete('/location/:id', LocationCtrl.deleteLocation)
router.get('/location/:id', LocationCtrl.getLocationById)
router.get('/locations', LocationCtrl.getLocations)

module.exports = router