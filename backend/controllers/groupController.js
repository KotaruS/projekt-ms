const asyncHandler = require('express-async-handler')
const Group = require('../models/groupModel')
const User = require('../models/userModel')
const Post = require('../models/postModel')
const generateSlug = require('../services/miscServices')


// @desc Create a new group under logged in user
// @route POST api/groups/create
// @access Private
const createGroup = asyncHandler(async (req, res) => {
  const { name, description } = req.body
  const user = req.token?.id
  const image = req.file?.buffer && `data:${req.file.mimetype};base64,${req.file?.buffer.toString('base64')}`
  if (!user || !name) {
    res.status(400)
    throw new Error('Please provide all data.')
  }
  const groupExists = await Group.findOne({ name })
  if (groupExists) {
    res.status(400)
    throw new Error('Group with the same name already exists, use different name.')
  }
  const uri = await generateSlug(2, name, Group)
  const group = await Group.create({
    name,
    description,
    image,
    uri,
    owner: user,
    members: [user]
  })

  if (group) {
    // inserts group into user model
    const creator = await User.findById(user)
    creator.groups = [...creator.groups, group._id]
    creator.save()
    res.status(201).json(group)
  } else {
    res.status(400)
    throw new Error('Group could not be create')
  }
})


// @desc Checks if user under certain name/email exists
// @route GET api/users/?params
// @access Public
const groupExists = asyncHandler(async (req, res) => {
  if (req.query?.name) {
    const group = await Group.findOne({ 'name': req.query?.name }).select('name')
    res.status(200).json(!!group)
  } else {
    res.status(400).json(false)
  }
})

// @desc Gets all groups
// @route GET api/groups/dev
// @access Dev
const getGroups = asyncHandler(async (req, res) => {
  const groups = await Group.find().populate('owner', '-password')
  res.status(200).json(groups)
})
// @desc Gets all data of a group
// @route GET api/groups/:uri
// @access Public
const returnGroup = asyncHandler(async (req, res) => {
  const { _id: id, name, uri, image, posts, members, owner, restricted } = req.data
  const token = req.token?.id
  const isMember = members.indexOf(token) !== -1

  // returns minimal data when group is restricted and user is not a member
  if (!restricted || isMember) {
    res.status(200).json(req.data)
  } else {
    res.status(200).json({
      name,
      image,
      owner,
      uri,
      posts: (!restricted || token === id) ? posts : [],
      restricted,
    })
  }
})

// @desc Update group data
// @route PUT api/groups/:uri
// @access Private
const updateGroupDetails = asyncHandler(async (req, res) => {
  const { name, uri, owner, } = req.data
  const token = req.token?.id
  req.body.uri = (name === req.body.name || !req.body.name) ? uri : await generateSlug(2, req.body.name, Group)
  req.body.image = req.body.image === ''
    ? ''
    : req.file?.buffer
    && `data:${req.file?.mimetype};base64,${req.file?.buffer.toString('base64')}`
  try {
    if (token == owner) {
      // update only certain values to avoid overwriting members / posts list with bad request
      ['name', 'description', 'image', 'uri', 'restricted'].forEach((key) => {
        req.data[key] = req.body[key] ?? req.data[key]
      })
      await req.data.save()
      res.status(200).json(req.data)
    } else {
      res.status(403)
      throw new Error('You do not have permission to update group\'s data')
    }
  } catch {
    res.status(500)
    throw new Error('Could not update group details')
  }
})

// @desc Join group 
// @route GET api/groups/join/:uri
// @access Private
const joinGroup = asyncHandler(async (req, res) => {
  const { _id: id, name, members, pendingMembers, restricted } = req.data
  const token = req.token?.id

  if (members.indexOf(token) !== -1) {
    res.status(400)
    throw new Error('You are already in the group.')
  }

  try {
    if (restricted) {
      pendingMembers = [...pendingMembers, token]
      res.status(200).json({ message: "Applied to group\'s membership, awaiting owner\'s approval." })
    } else {
      req.data.members = [...members, token]
      req.data.save()
      const user = await User.findById(token)
      user.groups = [...user.groups, id]
      user.save()
      res.status(200).json({ message: `You have succesfully joined ${name}.` })
    }
  } catch {
    res.status(400)
    throw new Error('Could not join group.')
  }
})


// @desc Leave group 
// @route GET api/groups/leave/:uri
// @access Private
const leaveGroup = asyncHandler(async (req, res) => {
  const { _id: id, name, members, owner } = req.data
  const token = req.token?.id

  if (members.indexOf(token) === -1) {
    res.status(400)
    throw new Error('You not in the group')
  }
  if (token == owner) {
    res.status(400)
    throw new Error('Owner cannot leave group')
  }
  try {
    if (token) {
      await Group.updateOne({ '_id': id }, { $pull: { members: token } })
      await User.updateOne({ '_id': token }, { $pull: { groups: id } })
      res.status(200).json({ message: `You have left the group ${name}` })
    } else {
      res.status(400)
      throw new Error('No user provided')
    }
  } catch {
    res.status(400)
    throw new Error('Could not leave group for unknown reason')
  }
})

// @desc deletes a group (only owner can do that)
// @route DELETE api/groups/:uri
// @access Private
const deleteGroup = asyncHandler(async (req, res) => {
  const { _id: id, name, owner, members, posts } = req.data
  const token = req.token?.id
  if (token == owner) {
    req.data.remove()
    // updates all members' groups list
    await User.updateMany({ '_id': members }, { $pull: { groups: id } })
    // removes all posts under group
    await Post.deleteMany({ '_id': posts })
    res.status(200).json({ message: `Succesfully deleted group ${name}` })
  } else {
    res.status(403)
    throw new Error('You do not have permission to delete this group.')
  }
})

module.exports = {
  createGroup,
  getGroups,
  groupExists,
  returnGroup,
  updateGroupDetails,
  joinGroup,
  leaveGroup,
  deleteGroup
}