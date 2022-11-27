const express = require('express')
const router = express.Router()
const Conference = require('../models/conference')

// Getting all
router.get('/', async (req, res) => {
  try {
    const conferences = await Conference.find()
    res.json(conferences)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting One
router.get('/:id', getConference, (req, res) => {
  res.json(res.conference)
})

async function getConference(req, res, next) {
  let conference
  try {
    conference = await Conference.find({ 'id': req.params.id})
    if (conference == null) {
      return res.status(404).json({ message: 'Cannot find conference' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.conference = conference
  next()
}

// Creating one
router.post('/', async (req, res) => {
  const conference = new Conference({
    name: req.body.name,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    events: req.body.events
  })
  try {
    const newUser = await conference.save()
    res.status(201).json(newUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router