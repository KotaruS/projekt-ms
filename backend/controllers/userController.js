const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// @desc register new user
// @route POST api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please enter all fields.')
  }
  // checks if user with email or username exists
  const userExists = await User.findOne({ $or: [{name}, {email}]})
  if (userExists) {
    res.status(400)
    throw new Error('Name or email adress is already used.')
  }
  const salt = await bcrypt.genSalt()
  const hashedpassword = await bcrypt.hash(password, salt)
  const user = await User.create({
    name,
    email,
    password: hashedpassword,
  })
  // if user created sucesfully
  if (user) {
    res.status(201).json([{ message: 'New user created user' }, {
      _id: user.id,
      name: user.name,
      email: user.email
    }])
  } else {
    res.status(500)
    throw new Error('User could not be created')
  }

})

// @desc Authenticate a user
// @route POST api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json([{ message: `User ${user.name} succesfully logged in.` }, {
      _id: user.id,
      name: user.name,
      email: user.email,
    }])
  } else {
    res.status(400)
    throw new Error(`Incorrect email or password`)
  }
})

// @desc get user data
// @route POST api/users/:username
// @access Public
const getUserData = asyncHandler(async (req, res) => {
  // const user = User.findById(req.params.id)
  const user = await User.find()
  res.status(200).json(user)
})

// @desc Delete user
// @route DELETE api/users:id
// @access Private
// const registerUser = asyncHandler(async (req, res) => {
//   res.status(200).json({ message: 'registered user' })
// })


module.exports = { registerUser, loginUser, getUserData }