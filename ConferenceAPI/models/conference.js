const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  speaker: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true,
  },
  room: {
    type: Number,
    required: true
  }
})


const conferenceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true
  },
  events: {
    type: [eventSchema],
    required: true
  }
})

module.exports = mongoose.model('conference', conferenceSchema)