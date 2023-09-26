//use the database schema we have defined
const Visitor = require('../models/visitor-model')

// this method creates a visitor in the database
// it expects a POST call from the router, the data should be in the json object passed
createVisitor = (req, res) => {
  const body = req.body

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a Visitor',
    })
  }

  const visitor = new Visitor(body)

  if (!visitor) {
    return res.status(400).json({ success: false, error: err })
  }

  visitor
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        id: Visitor._id,
        message: 'Visitor created!',
      })
    })
    .catch(error => {
      return res.status(400).json({
        error,
        message: 'Visitor not created!',
      })
    })
}

// this method updates a visitor in the database
// it expects a PUT call from the router, the id should be in the json object passed
const updateVisitor = (req, res) => {
  const body = req.body

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a body to update',
    })
  }

  Visitor.findOne({ _id: req.params.id })
    .then(Visitor => {
      if (!Visitor) {
        return res.status(404).json({
          message: 'Visitor not found!',
        })
      }

      //Update visitor data here
      Visitor.name = body.name
      Visitor.address = body.address

      Visitor.save()
        .then(() => {
          return res.status(200).json({
            success: true,
            id: Visitor._id,
            message: 'Visitor updated!',
          })
        })
        .catch(error => {
          return res.status(404).json({
            error,
            message: 'Visitor not updated!',
          })
        })
    })
    .catch(err => {
      return res.status(404).json({
        err,
        message: 'Visitor not found!',
      })
    })
}

// this method deletes a visitor from the database
// it expects a DELETE call from the router and an specific id in the URL
const deleteVisitor = (req, res) => {
  Visitor.findOneAndDelete({ _id: req.params.id })
    .then(Visitor => {
      if (!Visitor) {
        return res.status(404).json({ success: false, error: `Visitor not found` })
      }
      return res.status(200).json({ success: true, data: Visitor })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err })
    })
}

// this method finds a specific visitor from the database
// it expects a GET call from the router and a specific id in the URL
const getVisitorById = (req, res) => {
  Visitor.findOne({ _id: req.params.id })
    .then(Visitor => {
      if (!Visitor) {
        return res.status(404).json({ success: false, error: `Visitor not found` })
      }
      return res.status(200).json({ success: true, data: Visitor })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err })
    })
}

// this method returns all visitors from the database
// it expects a GET call from the router
const getVisitors = (req, res) => {
  Visitor.find({})
    .then(Visitors => {
      if (!Visitors.length) {
        return res.status(404).json({ success: false, error: `Visitor not found` })
      }
      return res.status(200).json({ success: true, data: Visitors })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err })
    })
}

// let our router know what methods it can map to
module.exports = {
  createVisitor,
  updateVisitor,
  deleteVisitor,
  getVisitors,
  getVisitorById,
}