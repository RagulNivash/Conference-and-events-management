const mongoose = require('mongoose')

const registrationSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true
  },
  conferenceid: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('registration', registrationSchema)