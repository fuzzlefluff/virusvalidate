const express = require('express')

const AccountCtrl = require('../controllers/account-ctrl')

const router = express.Router()

router.post('/Account', AccountCtrl.createAccount)
router.put('/Account/:id', AccountCtrl.updateAccount)
router.delete('/Account/:id', AccountCtrl.deleteAccount)
router.get('/Account/:id', AccountCtrl.getAccountById)
router.get('/Accounts', AccountCtrl.getAccounts)
router.post('/Login', AccountCtrl.loginCheck)

module.exports = router