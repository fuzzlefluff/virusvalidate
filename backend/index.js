const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./db')
const locationRouter = require('./routes/location-router')
const conditionRouter = require('./routes/condition-router')
const visitorRouter = require('./routes/visitor-router')
const accountRouter = require('./routes/account-router')
const appointmentRouter = require('./routes/appointment-router')

const app = express()
const apiPort = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api', locationRouter)
app.use('/api', conditionRouter)
app.use('/api', visitorRouter)
app.use('/api', accountRouter)
app.use('/api', appointmentRouter)

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))