const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Post = require('../models/postModel')
const Group = require('../models/groupModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { isEmail } = require('validator')
const generateSlug = require('../services/miscServices')

// @desc register new user
// @route POST api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  const image = req.file?.buffer && `data:${req.file.mimetype};base64,${req.file?.buffer.toString('base64')}`

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please enter all fields.')
  }

  if (!isEmail(email)) {
    res.status(400)
    throw new Error('Invalid email address')
  }
  // checks if user with email or username exists
  const userExists = await User.findOne({ $or: [{ name }, { email }] })
  if (userExists) {
    res.status(400)
    throw new Error('Name or email adress is already used.')
  }
  // generates URI, if conflicting URI exists -> appends 4 digits (max retries: 2)
  const uri = await generateSlug(2, name, User)
  const hashedpassword = await hashPassword(password)
  const user = await User.create({
    name,
    email,
    image,
    password: hashedpassword,
    uri,
  })
  // checks whether user is created
  if (user) {
    res.status(201).json({
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        uri: user.uri,
        posts: user.posts,
        groups: user.groups,
        restricted: user.restricted,
      },
      token: generateToken(user.id),
    })
  } else {
    res.status(500)
    throw new Error('User could not be created')
  }
})

// @desc Login a user
// @route POST api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body
  let user, type
  const errLookup = {
    email: 'Incorrect email address or password',
    name: 'Incorrect username or password',
  }
  // checks if user exists under given username or email adress
  if (await isEmail(identifier)) {
    user = await User.findOne({ email: identifier })
    type = 'email'
  } else {
    user = await User.findOne({ name: identifier })
    type = 'name'
  }
  // password authentication
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      uri: user.uri,
      image: user.image,
      posts: user.posts,
      groups: user.groups,
      restricted: user.restricted,
      token: generateToken(user.id),
    })
  } else {
    res.status(400)
    throw new Error(errLookup[type])
  }
})

// @desc get user data from his profile
// @route GET api/users/:uri
// @access Public
const returnUser = asyncHandler(async (req, res) => {
  const { _id: id, name, uri, image, posts, groups, restricted } = req.data
  const token = req.token?.id
  await req.data.populate('groups', '-image -posts -members')

  // user requesting his data gets full data
  if (token == id) {
    res.status(200).json({
      _id: req.data.id,
      name: req.data.name,
      email: req.data.email,
      uri: req.data.uri,
      image: req.data.image,
      posts: req.data.posts,
      groups: req.data.groups,
      restricted: req.data.restricted,
    })
  }
  res.status(200).json({
    _id: id,
    name,
    image,
    uri,
    // only same user can access restricted values
    posts: (!restricted.posts || token === id) ? posts : [],
    groups: (!restricted.groups || token === id) ? groups : [],
  })

})

// @desc Checks if user under certain name/email exists
// @route GET api/users/?params
// @access Public
const userExists = asyncHandler(async (req, res) => {
  if (req.query?.name) {
    const user = await User.findOne({ 'name': req.query?.name }).select('name')
    res.status(200).json(!!user)
  } else if (req.query?.email) {
    const user = await User.findOne({ 'email': req.query?.email }).select('email')
    res.status(200).json(!!user)
  } else {
    res.status(400).json(false)
  }
})

// @desc get all data of the user from token
// @route GET api/users/me
// @access Private
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.token.id).select('-password').populate('posts', '-image -author -group').populate('groups', '-image -posts -members')
  res.status(200).json(user)
})

// @desc get all users
// @route POST api/users/dev
// @access Dev
const getUsers = asyncHandler(async (req, res) => {
  const user = await User.find()
  res.status(200).json(user)
})

// @desc Edit user details
// @route PUT api/users/:uri
// @access Private
const editUser = asyncHandler(async (req, res) => {
  const { _id: id, name, uri, password } = req.data
  const token = req.token?.id
  const { oldPassword, newPassword, restricted } = req.body
  // when user updates their password
  if (oldPassword && newPassword) {
    if (!(await bcrypt.compare(oldPassword, password))) {
      res.status(400)
      throw new Error('Provided password does not match original password')
    }
    else { req.body.password = await hashPassword(newPassword) }
  }
  if (!restricted.posts || !restricted.groups) {
    req.body.restricted = JSON.parse(restricted)
  }
  // generate new uri only when new name is provided
  req.body.uri = (name === req.body.name || !req.body.name)
    ? uri : await generateSlug(2, req.body.name, User)
  try {
    if (token == id) {
      // update only certain values to avoid overwriting groups / posts list with bad request
      ['name', 'email', 'password', 'image', 'uri', 'restricted'].forEach(
        (key) => req.data[key] = req.body[key] || req.data[key])
      await req.data.save()
      res.status(200).json(req.data)
    } else {
      res.status(403)
      throw new Error('Unauthorized user token')
    }
  } catch {
    res.status(400)
    throw new Error('Name or address is already taken')
  }
})

// @desc Delete user
// @route DELETE api/users:uri
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { _id: id, name, posts, groups } = req.data
  const token = req.token?.id
  if (token == id) {
    const isOwner = await Group.findOne({ 'owner': id })
    if (isOwner) {
      res.status(400)
      throw new Error('You must not own any group to delete an account.')
    }
    req.data.remove()
    // removes user from groups members list
    await Group.updateMany({ '_id': groups }, { $pull: { members: id } })
    // removes all references to user in his posts while keeping the post
    await Post.updateMany({ '_id': posts }, { $unset: { author: '' } })
    // removes all references to user in comments while keeping the comment
    await Post.updateMany({ 'comments.author': id }, { $unset: { 'comments.author': '' } })
    await Post.updateMany({ 'comments.replyTo': id }, { $unset: { 'comments.replyTo': '' } })
    res.status(200).json({ message: `Succesfully deleted user ${name}` })
  } else {
    res.status(403)
    throw new Error('You do not have permission to delete this user profile.')
  }
})

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_CODE, {
    expiresIn: '30d'
  })
}

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(11)
  const hashedpassword = await bcrypt.hash(password, salt)
  return hashedpassword
}

module.exports = {
  registerUser,
  loginUser,
  returnUser,
  userExists,
  getUser,
  getUsers,
  editUser,
  deleteUser
}