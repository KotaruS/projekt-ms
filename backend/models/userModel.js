const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter name'],
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
  posts: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: 'Post'
  }
}, {
  timestamps: true,
})

module.exports = mongoose.model('User', userSchema)