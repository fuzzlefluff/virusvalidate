//use the database schema we have defined
const Location = require('../models/location-model')

//we need a reference to our Accounts, to check for authentication
const Account = require('../models/account-model')

//this method checks if a valid api key was sent with the data.
async function checkAPIkey(req) {
  try {
    const apiKeyReq = req.headers['apikey'];
    console.log(apiKeyReq)

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
    console.error('Error checking API key:', error);
    throw error;
  }
}

// this method creates a location in the database
// it expects a POST call from the router, the data should be in the json object passed
// it also expects a valid apikey in the header 'apikey'
createLocation = (req, res) => {

  checkAPIkey(req).then(keyValid => {
    if (!keyValid) {
      return res.status(401).json({ success: false, erorr: 'Unauthorized' })
    }

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

  }).catch((error) => {
    console.error('Error checking API key:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  });
}

// this method updates a location in the database
// it expects a PUT call from the router, the id should be in the json object passed
// it also expects a valid apikey in the header 'apikey'
const updateLocation = (req, res) => {

  checkAPIkey(req).then(keyValid => {
    if (!keyValid) {
      return res.status(401).json({ success: false, erorr: 'Unauthorized' })
    }

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
  }).catch((error) => {
    console.error('Error checking API key:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  });
}

// this method deletes a location from the database
// it expects a DELETE call from the router and an specific id in the URL
// it also expects a valid apikey in the header 'apikey'
const deleteLocation = (req, res) => {

  checkAPIkey(req).then(keyValid => {
    if (!keyValid) {
      return res.status(401).json({ success: false, erorr: 'Unauthorized' })
    }

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
  }).catch((error) => {
    console.error('Error checking API key:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  });

}

// this method finds a specific location from the database
// it expects a GET call from the router and a specific id in the URL
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

// this method returns all locations from the database
// it expects a GET call from the router
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

// let our router know what methods it can map to
module.exports = {
  createLocation,
  updateLocation,
  deleteLocation,
  getLocations,
  getLocationById,
}