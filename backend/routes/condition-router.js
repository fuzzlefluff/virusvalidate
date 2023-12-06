// Here we import and define a router that listens for HTML calls
// and directs the information to the correct methods
const express = require('express');
const ConditionCtrl = require('../controllers/condition-ctrl');

const router = express.Router();

// This is where the mapping happens, where we match a post method to a defined URL
// with a creation method, update method, deletion method, get methods,
// and anything else we could need like a login check
router.post('/condition', ConditionCtrl.createCondition);
router.put('/condition/:id', ConditionCtrl.updateCondition);
router.delete('/condition/:id', ConditionCtrl.deleteCondition);
router.get('/condition/:id', ConditionCtrl.getConditionById);
router.get('/conditions', ConditionCtrl.getConditions);

module.exports = router;
