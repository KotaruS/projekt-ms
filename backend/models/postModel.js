const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter all values']
  },
  text: {
    type: String,
    required: false
  }
}, {
  timestamps: true,
})

module.exports = mongoose.model('Post', postSchema)