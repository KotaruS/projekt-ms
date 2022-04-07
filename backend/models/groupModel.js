const mongoose = require('mongoose')

const groupSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter name'],
    maxLength: 64,
    unique: true,
  },
  description: String,
  image: String,
  uri: {
    type: String,
    required: [true, 'You must generate uri'],
    unique: true,
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, 'Group must have a owner'],
    ref: 'User',
  },
  posts: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Post',
  }],
  members: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  }],
  pendingMembers: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  }],
  restricted: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Group', groupSchema)