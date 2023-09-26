//Here we import and define a router that listens for HTML calls and directs the information to the correct methods
const express = require('express')

const VisitorCtrl = require('../controllers/visitor-ctrl')

const router = express.Router()

//This is where the mapping happens, where we match a post method to a defined URL with a creation method, update method, deletion method, get methods, and anything else we could need like a login check
router.post('/visitor', VisitorCtrl.createVisitor)
router.put('/visitor/:id', VisitorCtrl.updateVisitor)
router.delete('/visitor/:id', VisitorCtrl.deleteVisitor)
router.get('/visitor/:id', VisitorCtrl.getVisitorById)
router.get('/visitors', VisitorCtrl.getVisitors)

module.exports = router