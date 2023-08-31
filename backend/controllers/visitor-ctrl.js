const Visitor = require('../models/visitor-model')

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

module.exports = {
    createVisitor,
    updateVisitor,
    deleteVisitor,
    getVisitors,
    getVisitorById,
}