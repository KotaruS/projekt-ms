const mongoose = require('mongoose')
const commentSchema = require('./commentModel')

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter all values']
  },
  content: {
    type: String,
    required: [true, 'You must provide content']
  },
  uri: {
    type: String,
    required: [true, 'You must generate uri'],
    unique: true
  },
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  group: {
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, 'All posts must belong to a group'],
    ref: 'Group',
  },
  comments: [commentSchema],
  restricted: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Post', postSchema)