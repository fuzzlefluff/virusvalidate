const express = require('express')

const ConditionCtrl = require('../controllers/condition-ctrl')

const router = express.Router()

router.post('/condition', ConditionCtrl.createCondition)
router.put('/condition/:id', ConditionCtrl.updateCondition)
router.delete('/condition/:id', ConditionCtrl.deleteCondition)
router.get('/condition/:id', ConditionCtrl.getConditionById)
router.get('/conditions', ConditionCtrl.getConditions)

module.exports = router