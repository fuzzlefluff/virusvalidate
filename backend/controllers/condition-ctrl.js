/* eslint-disable no-underscore-dangle */
// use the database schema we have defined
const ConditionSchema = require('../models/condition-model');

// we need a reference to our Accounts, to check for authentication
const AccountSchema = require('../models/account-model');

// this method checks if a valid api key was sent with the data.
async function checkAPIkey(req) {
  try {
    const apiKeyReq = req.headers.apikey;
    // eslint-disable-next-line no-console
    console.log(apiKeyReq);

    if (typeof apiKeyReq === 'undefined' || apiKeyReq === null) {
      return false;
    }
    const trimmedApiKey = apiKeyReq.trim();

    const foundAccount = await AccountSchema.findOne({ apikey: trimmedApiKey }).exec();

    if (!foundAccount) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

// this method creates a condition in the database
// it expects a POST call from the router, the data should be in the json object passed
// it also expects a valid apikey in the header 'apikey'
const createCondition = (req, res) => {
  checkAPIkey(req).then((keyValid) => {
    if (!keyValid) {
      return res.status(401).json({ success: false, erorr: 'Unauthorized' });
    }

    const { body } = req;

    if (!body) {
      return res.status(400).json({
        success: false,
        error: 'You must provide a Condition',
      });
    }

    const condition = new ConditionSchema(body);

    if (!condition) {
      return res.status(400).json({ success: false, error: 'invalid body' });
    }

    return condition
      .save()
      .then(() => res.status(201).json({
        success: true,
        id: ConditionSchema._id,
        message: 'Condition created!',
      }))
      .catch((error) => res.status(400).json({
        error,
        message: 'Condition not created!',
      }));
  }).catch(() => res.status(500).json({ success: false, error: 'Internal Server Error' }));
};

// this method updates a condition in the database
// it expects a PUT call from the router, the id should be in the json object passed
// it also expects a valid apikey in the header 'apikey'
const updateCondition = (req, res) => {
  checkAPIkey(req).then((keyValid) => {
    if (!keyValid) {
      return res.status(401).json({ success: false, erorr: 'Unauthorized' });
    }
    const { body } = req;

    if (!body) {
      return res.status(400).json({
        success: false,
        error: 'You must provide a body to update',
      });
    }

    return ConditionSchema.findOne({ _id: req.params.id })
      .then((Condition) => {
        if (!Condition) {
          return res.status(404).json({
            message: 'Condition not found!',
          });
        }

        // Assign updated values to Condition
        const updatedCondition = {
          name: body.name,
          address: body.address,
        };
        Object.assign(Condition, updatedCondition);

        return Condition.save()
          .then(() => res.status(200).json({
            success: true,
            id: Condition._id,
            message: 'Condition updated!',
          }))
          .catch((error) => res.status(404).json({
            error,
            message: 'Condition not updated!',
          }));
      })
      .catch((err) => res.status(404).json({
        err,
        message: 'Condition not found!',
      }));
  }).catch(() => res.status(500).json({ success: false, error: 'Internal Server Error' }));
};

// this method deletes a condition from the database
// it expects a DELETE call from the router and an specific id in the URL
// it also expects a valid apikey in the header 'apikey'
const deleteCondition = (req, res) => {
  checkAPIkey(req).then((keyValid) => {
    if (!keyValid) {
      return res.status(401).json({ success: false, erorr: 'Unauthorized' });
    }
    return ConditionSchema.findOneAndDelete({ _id: req.params.id })
      .then((Condition) => {
        if (!Condition) {
          return res.status(404).json({ success: false, error: 'Condition not found' });
        }
        return res.status(200).json({ success: true, data: Condition });
      })
      .catch((err) => res.status(400).json({ success: false, error: err }));
  }).catch(() => res.status(500).json({ success: false, error: 'Internal Server Error' }));
};

// this method finds a specific condition from the database
// it expects a GET call from the router and a specific id in the URL
const getConditionById = (req, res) => {
  ConditionSchema.findOne({ _id: req.params.id })
    .then((Condition) => {
      if (!Condition) {
        return res.status(404).json({ success: false, error: 'Condition not found' });
      }
      return res.status(200).json({ success: true, data: Condition });
    })
    .catch((err) => res.status(400).json({ success: false, error: err }));
};

// this method returns all conditions from the database
// it expects a GET call from the router
const getConditions = (req, res) => {
  ConditionSchema.find({})
    .then((Conditions) => {
      if (!Conditions.length) {
        return res.status(404).json({ success: false, error: 'Condition not found' });
      }
      return res.status(200).json({ success: true, data: Conditions });
    })
    .catch((err) => res.status(400).json({ success: false, error: err }));
};

// let our router know what methods it can map to
module.exports = {
  createCondition,
  updateCondition,
  deleteCondition,
  getConditions,
  getConditionById,
};
