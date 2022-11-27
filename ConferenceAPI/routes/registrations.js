const express = require('express')
const router = express.Router()
const Registration = require('../models/registration')

// Getting all
router.get('/', async (req, res) => {
  try {
    const registrations = await Registration.find()
    res.json(registrations)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting One
router.get('/:userid', getRegistration, (req, res) => {
  res.json(res.registration)
})

async function getRegistration(req, res, next) {
  let registration
  try {
    registration = await Registration.find({ 'userid': req.params.userid})
    if (registration == null) {
      return res.status(404).json({ message: 'Cannot find registration' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.registration = registration
  next()
}

// Creating one
router.post('/', async (req, res) => {
  const registration = new Registration({
    userid: req.body.userid,
    conferenceid: req.body.conferenceid
  })
  try {
    const newRegistration = await registration.save()
    res.status(201).json(newRegistration)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router