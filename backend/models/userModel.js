const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter name'],
    maxLength: 64,
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Please enter valid email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please enter valid password']
  },
  uri: {
    type: String,
    required: [true, 'You must generate uri'],
    unique: true
  },
  image: String,
  posts: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Post'
  }],
  groups: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Group'
  }],
  restricted: {
    posts: {
      type: Boolean,
      default: false
    },
    groups: {
      type: Boolean,
      default: false,
    },
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('User', userSchema)