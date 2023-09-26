//use the database schema we have defined
const Condition = require('../models/condition-model')

// this method creates a condition in the database
// it expects a POST call from the router, the data should be in the json object passed
createCondition = (req, res) => {
  const body = req.body

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a Condition',
    })
  }

  const condition = new Condition(body)

  if (!condition) {
    return res.status(400).json({ success: false, error: err })
  }

  condition
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        id: Condition._id,
        message: 'Condition created!',
      })
    })
    .catch(error => {
      return res.status(400).json({
        error,
        message: 'Condition not created!',
      })
    })
}

// this method updates a condition in the database
// it expects a PUT call from the router, the id should be in the json object passed
const updateCondition = (req, res) => {
  const body = req.body

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a body to update',
    })
  }

  Condition.findOne({ _id: req.params.id })
    .then(Condition => {
      if (!Condition) {
        return res.status(404).json({
          message: 'Condition not found!',
        })
      }

      //Update condition data here
      Condition.name = body.name
      Condition.address = body.address

      Condition.save()
        .then(() => {
          return res.status(200).json({
            success: true,
            id: Condition._id,
            message: 'Condition updated!',
          })
        })
        .catch(error => {
          return res.status(404).json({
            error,
            message: 'Condition not updated!',
          })
        })
    })
    .catch(err => {
      return res.status(404).json({
        err,
        message: 'Condition not found!',
      })
    })
}

// this method deletes a condition from the database
// it expects a DELETE call from the router and an specific id in the URL
const deleteCondition = (req, res) => {
  Condition.findOneAndDelete({ _id: req.params.id })
    .then(Condition => {
      if (!Condition) {
        return res.status(404).json({ success: false, error: `Condition not found` })
      }
      return res.status(200).json({ success: true, data: Condition })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err })
    })
}

// this method finds a specific condition from the database
// it expects a GET call from the router and a specific id in the URL
const getConditionById = (req, res) => {
  Condition.findOne({ _id: req.params.id })
    .then(Condition => {
      if (!Condition) {
        return res.status(404).json({ success: false, error: `Condition not found` })
      }
      return res.status(200).json({ success: true, data: Condition })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err })
    })
}

// this method returns all conditions from the database
// it expects a GET call from the router
const getConditions = (req, res) => {
  Condition.find({})
    .then(Conditions => {
      if (!Conditions.length) {
        return res.status(404).json({ success: false, error: `Condition not found` })
      }
      return res.status(200).json({ success: true, data: Conditions })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err })
    })
}

// let our router know what methods it can map to
module.exports = {
  createCondition,
  updateCondition,
  deleteCondition,
  getConditions,
  getConditionById,
}