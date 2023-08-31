const Location = require('../models/location-model')

createLocation = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a location',
        })
    }

    const location = new Location(body)

    if (!location) {
        return res.status(400).json({ success: false, error: err })
    }

    location
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: location._id,
                message: 'Location created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Location not created!',
            })
        })
}

const updateLocation = (req, res) => {
  const body = req.body

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a body to update',
    })
  }

  Location.findOne({ _id: req.params.id })
    .then(location => {
      if (!location) {
        return res.status(404).json({
          message: 'Location not found!',
        })
      }
      location.name = body.name
      location.address = body.address
      
      location.save()
        .then(() => {
          return res.status(200).json({
            success: true,
            id: location._id,
            message: 'Location updated!',
          })
        })
        .catch(error => {
          return res.status(404).json({
            error,
            message: 'Location not updated!',
          })
        })
    })
    .catch(err => {
      return res.status(404).json({
        err,
        message: 'Location not found!',
      })
    })
}

const deleteLocation = (req, res) => {
  Location.findOneAndDelete({ _id: req.params.id })
    .then(location => {
      if (!location) {
        return res.status(404).json({ success: false, error: `Location not found` })
      }
      return res.status(200).json({ success: true, data: location })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err })
    })
}

const getLocationById = (req, res) => {
  Location.findOne({ _id: req.params.id })
    .then(location => {
      if (!location) {
        return res.status(404).json({ success: false, error: `Location not found` })
      }
      return res.status(200).json({ success: true, data: location })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err })
    })
}

const getLocations = (req, res) => {
  Location.find({})
    .then(locations => {
      if (!locations.length) {
        return res.status(404).json({ success: false, error: `Location not found` })
      }
      return res.status(200).json({ success: true, data: locations })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err })
    })
}

module.exports = {
    createLocation,
    updateLocation,
    deleteLocation,
    getLocations,
    getLocationById,
}