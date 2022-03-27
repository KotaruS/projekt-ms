const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter all values']
  },
  text: {
    type: String,
    required: false
  },
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, 'All posts must have author'],
    ref: 'User'
  }
}, {
  timestamps: true,
})

module.exports = mongoose.model('Post', postSchema)