const Account = require('../models/account-model')

createAccount = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Account',
        })
    }

    const account = new Account(body)

    if (!account) {
        return res.status(400).json({ success: false, error: err })
    }

    account
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: Account._id,
                message: 'Account created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Account not created!',
            })
        })
}

const updateAccount = (req, res) => {
  const body = req.body

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a body to update',
    })
  }

  Account.findOne({ _id: req.params.id })
    .then(Account => {
      if (!Account) {
        return res.status(404).json({
          message: 'Account not found!',
        })
      }
      Account.name = body.name
      Account.address = body.address
      
      Account.save()
        .then(() => {
          return res.status(200).json({
            success: true,
            id: Account._id,
            message: 'Account updated!',
          })
        })
        .catch(error => {
          return res.status(404).json({
            error,
            message: 'Account not updated!',
          })
        })
    })
    .catch(err => {
      return res.status(404).json({
        err,
        message: 'Account not found!',
      })
    })
}

const deleteAccount = (req, res) => {
  Account.findOneAndDelete({ _id: req.params.id })
    .then(Account => {
      if (!Account) {
        return res.status(404).json({ success: false, error: `Account not found` })
      }
      return res.status(200).json({ success: true, data: Account })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err })
    })
}

const getAccountById = (req, res) => {
  Account.findOne({ _id: req.params.id })
    .then(Account => {
      if (!Account) {
        return res.status(404).json({ success: false, error: `Account not found` })
      }
      return res.status(200).json({ success: true, data: Account })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err })
    })
}

const getAccounts = (req, res) => {
  Account.find({})
    .then(Accounts => {
      if (!Accounts.length) {
        return res.status(404).json({ success: false, error: `Account not found` })
      }
      return res.status(200).json({ success: true, data: Accounts })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err })
    })
}

const loginCheck = (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a body to check',
    });
  }

  Account.findOne({
    $or: [
      { _id: req.params.id },
      { email: req.body.email },
      { username: req.body.username },
    ],
  })
    .then((account) => {
      if (!account) {
        
        return res.status(400).json({ success: false, error: `Login Failed` });
      }
	  
	  if(req.body.password == null) {
		 return res.status(400).json({ success: false, error: `Login Failed` }); 
	  }
      if (req.body.password.toString() !== account.password.toString()) {
        return res.status(400).json({ success: false, error: `Login Failed` });
      }
	  
      return res.status(200).json({ success: true, data: account.username });
    })
    .catch((error) => {
   
      return res.status(500).json({ success: false, error: `Server error` });
    });
};


module.exports = {
    createAccount,
    updateAccount,
    deleteAccount,
    getAccounts,
    getAccountById,
	loginCheck,
}