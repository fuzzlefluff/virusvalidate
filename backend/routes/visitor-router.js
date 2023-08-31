const express = require('express')

const VisitorCtrl = require('../controllers/visitor-ctrl')

const router = express.Router()

router.post('/visitor', VisitorCtrl.createVisitor)
router.put('/visitor/:id', VisitorCtrl.updateVisitor)
router.delete('/visitor/:id', VisitorCtrl.deleteVisitor)
router.get('/visitor/:id', VisitorCtrl.getVisitorById)
router.get('/visitors', VisitorCtrl.getVisitors)

module.exports = router