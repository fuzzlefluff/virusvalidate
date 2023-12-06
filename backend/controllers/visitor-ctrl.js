// use the database schema we have defined
const VisitorSchema = require('../models/visitor-model');

// we need a reference to our Accounts, to check for authentication
const Account = require('../models/account-model');

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

    const foundAccount = await Account.findOne({ apikey: trimmedApiKey }).exec();

    if (!foundAccount) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

// this method creates a visitor in the database
// it expects a POST call from the router, the data should be in the json object passed
// it also expects a valid apikey in the header 'apikey'
const createVisitor = (req, res) => {
  checkAPIkey(req).then((keyValid) => {
    if (!keyValid) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { body } = req;

    if (!body) {
      return res.status(400).json({
        success: false,
        error: 'You must provide a Visitor',
      });
    }

    const visitor = new VisitorSchema(body);

    if (!visitor) {
      return res.status(400).json({ success: false, error: err });
    }

    visitor
      .save()
      .then(() => res.status(201).json({
        success: true,
        id: VisitorSchema._id,
        message: 'Visitor created!',
      }))
      .catch((error) => res.status(400).json({
        error,
        message: 'Visitor not created!',
      }));
  }).catch((error) => {
    console.error('Error checking API key:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  });
};

// this method updates a visitor in the database
// it expects a PUT call from the router, the id should be in the json object passed
// it also expects a valid apikey in the header 'apikey'
const updateVisitor = (req, res) => checkAPIkey(req)
  .then((keyValid) => {
    if (!keyValid) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const { body } = req;

    if (!body) {
      return res.status(400).json({
        success: false,
        error: 'You must provide a body to update',
      });
    }

    return VisitorSchema.findOne({ _id: req.params.id })
      .then((Visitor) => {
        if (!Visitor) {
          return res.status(404).json({
            message: 'Visitor not found!',
          });
        }

        // Assign updated values to Visitor
        const updatedVisitor = {
          name: body.name,
          address: body.address,
        };
        Object.assign(Visitor, updatedVisitor);

        return Visitor.save()
          .then(() => res.status(200).json({
            success: true,
            id: Visitor._id,
            message: 'Visitor updated!',
          }))
          .catch((error) => res.status(404).json({
            error,
            message: 'Visitor not updated!',
          }));
      })
      .catch((err) => res.status(404).json({
        err,
        message: 'Visitor not found!',
      }));
  })
  .catch(() => res.status(500).json({ success: false, error: 'Internal Server Error' }));

// this method deletes a visitor from the database
// it expects a DELETE call from the router and an specific id in the URL
// it also expects a valid apikey in the header 'apikey'
const deleteVisitor = (req, res) => checkAPIkey(req)
  .then((keyValid) => {
    if (!keyValid) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    return VisitorSchema.findOneAndDelete({ _id: req.params.id })
      .then((Visitor) => {
        if (!Visitor) {
          return res.status(404).json({ success: false, error: 'Visitor not found' });
        }
        return res.status(200).json({ success: true, data: Visitor });
      })
      .catch((err) => res.status(400).json({ success: false, error: err }));
  })
  .catch(() => res.status(500).json({ success: false, error: 'Internal Server Error' }));

// this method finds a specific visitor from the database
// it expects a GET call from the router and a specific id in the URL
const getVisitorById = (req, res) => {
  VisitorSchema.findOne({ _id: req.params.id })
    .then((Visitor) => {
      if (!Visitor) {
        return res.status(404).json({ success: false, error: 'Visitor not found' });
      }
      return res.status(200).json({ success: true, data: Visitor });
    })
    .catch((err) => res.status(400).json({ success: false, error: err }));
};

// this method returns all visitors from the database
// it expects a GET call from the router
const getVisitors = (req, res) => {
  VisitorSchema.find({})
    .then((Visitors) => {
      if (!Visitors.length) {
        return res.status(404).json({ success: false, error: 'Visitor not found' });
      }
      return res.status(200).json({ success: true, data: Visitors });
    })
    .catch((err) => res.status(400).json({ success: false, error: err }));
};

// let our router know what methods it can map to
module.exports = {
  createVisitor,
  updateVisitor,
  deleteVisitor,
  getVisitors,
  getVisitorById,
};
