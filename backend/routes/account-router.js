//Here we import and define a router that listens for HTML calls and directs the information to the correct methods
const express = require('express')

const AccountCtrl = require('../controllers/account-ctrl')

const router = express.Router()

//This is where the mapping happens, where we match a post method to a defined URL with a creation method, update method, deletion method, get methods, and anything else we could need like a login check
router.post('/Account', AccountCtrl.createAccount)
router.put('/Account/:id', AccountCtrl.updateAccount)
router.delete('/Account/:id', AccountCtrl.deleteAccount)
router.get('/Account/:id', AccountCtrl.getAccountById)
router.get('/Accounts', AccountCtrl.getAccounts)
router.post('/Login', AccountCtrl.loginCheck)

module.exports = router