/* eslint-disable no-console */
// This is our core file,
// where we define what routers are to be run on the server,
// and to connect to our database object we defined
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// import our routers and database connector
const db = require('./db');
const locationRouter = require('./routes/location-router');
const conditionRouter = require('./routes/condition-router');
const visitorRouter = require('./routes/visitor-router');
const accountRouter = require('./routes/account-router');
const appointmentRouter = require('./routes/appointment-router');

// define the express API server and what port it will listen to (3000)
const app = express();
const apiPort = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

// post an error to the console if the database connection failed for some reason/
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// spin up all our routers, that map HTML calls to our controllers
app.use('/api', locationRouter);
app.use('/api', conditionRouter);
app.use('/api', visitorRouter);
app.use('/api', accountRouter);
app.use('/api', appointmentRouter);

// run the server and post that it is running to the console.
app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
