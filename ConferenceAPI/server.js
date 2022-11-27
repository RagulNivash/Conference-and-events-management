require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))
  
app.use(cors({
    origin: '*'
}));

app.use(express.json())

const usersRouter = require('./routes/users')
const conferencesRouter = require('./routes/conferences')
const registrationsRouter = require('./routes/registrations')

app.use('/users', usersRouter)
app.use('/conferences', conferencesRouter)
app.use('/registrations', registrationsRouter)

app.listen(3000, () => console.log('Server Started'))