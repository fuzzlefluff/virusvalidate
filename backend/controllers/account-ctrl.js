/* eslint-disable no-underscore-dangle */
// use the database schema we have defined
const crypto = require('node:crypto');
const AccountSchema = require('../models/account-model');
// use the crypto module to generate keys on demand

// this method generates an API key to save to the account.
function generateRandomApiKey(length = 32) {
  const randomBytes = crypto.randomBytes(length);
  const apiKey = randomBytes.toString('hex');

  return apiKey;
}

// this method creates an account in the database
// it expects a POST call from the router, the data should be in the json object passed
const createAccount = (req, res) => {
  const { body } = req;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a Account',
    });
  }

  const account = new AccountSchema(body);
  account.apikey = generateRandomApiKey();

  if (!account) {
    return res.status(400).json({ success: false, error: 'not found' });
  }

  account
    .save()
    .then(() => res.status(201).json({
      success: true,
      id: AccountSchema._id,
      message: 'Account created!',
    }))
    .catch((error) => res.status(400).json({
      error,
      message: 'Account not created!',
    }));
  return null;
};

// this method updates an account in the database
// it expects a PUT call from the router, the id should be in the json object passed
const updateAccount = (req, res) => {
  const { body } = req;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a body to update',
    });
  }

  return AccountSchema.findOne({ _id: req.params.id })
    .then((Account) => {
      if (!Account) {
        return res.status(404).json({
          message: 'Account not found!',
        });
      }

      // Update account data here
      const updatedAccount = {
        name: body.name,
        address: body.address,
        apikey: generateRandomApiKey(),
      };
      Object.assign(Account, updatedAccount);

      return Account.save()
        .then(() => res.status(200).json({
          success: true,
          id: Account._id,
          message: 'Account updated!',
        }))
        .catch((error) => res.status(404).json({
          error,
          message: 'Account not updated!',
        }));
    })
    .catch((err) => res.status(404).json({
      err,
      message: 'Account not found!',
    }));
};

// this method deletes an account from the database
// it expects a DELETE call from the router and an specific id in the URL
const deleteAccount = (req, res) => {
  AccountSchema.findOneAndDelete({ _id: req.params.id })
    .then((Account) => {
      if (!Account) {
        return res.status(404).json({ success: false, error: 'Account not found' });
      }
      return res.status(200).json({ success: true, data: Account });
    })
    .catch((err) => res.status(400).json({ success: false, error: err }));
};

// this method finds a specific account from the database
// it expects a GET call from the router and a specific id in the URL
const getAccountById = (req, res) => {
  AccountSchema.findOne({ _id: req.params.id })
    .then((Account) => {
      if (!Account) {
        return res.status(404).json({ success: false, error: 'Account not found' });
      }
      return res.status(200).json({ success: true, data: Account });
    })
    .catch((err) => res.status(400).json({ success: false, error: err }));
};

// this method returns all accounts from the database
// it expects a GET call from the router
const getAccounts = (req, res) => {
  AccountSchema.find({})
    .then((Accounts) => {
      if (!Accounts.length) {
        return res.status(404).json({ success: false, error: 'Account not found' });
      }
      return res.status(200).json({ success: true, data: Accounts });
    })
    .catch((err) => res.status(400).json({ success: false, error: err }));
};

// this method is simply used to check if a given login is valid or not
// it expects a POST call from the router and the login info in a passed json object
// it will accept the account email, account id, or username, and sees if the password was correct.
const loginCheck = (req, res) => {
  const { body } = req;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a body to check',
    });
  }

  return AccountSchema.findOne({
    $or: [
      { _id: req.params.id },
      { email: req.body.email },
      { username: req.body.username },
    ],
  })
    .then((account) => {
      if (!account) {
        return res.status(400).json({ success: false, error: 'Login Failed' });
      }

      if (req.body.password == null) {
        return res.status(400).json({ success: false, error: 'Login Failed' });
      }
      if (req.body.password.toString() !== account.password.toString()) {
        return res.status(400).json({ success: false, error: 'Login Failed' });
      }

      return res.status(200).json({
        success: true,
        username: account.username,
        apikey: account.apikey,
      });
    })
    .catch(() => res.status(500).json({ success: false, error: 'Server error' }));
};

// let our router know what methods it can map to
module.exports = {
  createAccount,
  updateAccount,
  deleteAccount,
  getAccounts,
  getAccountById,
  loginCheck,
};
