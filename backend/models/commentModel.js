const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
  content: String,
}, {
  timestamps: true,
})

module.exports = commentSchema