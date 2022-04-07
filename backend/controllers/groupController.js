const asyncHandler = require('express-async-handler')
const Group = require('../models/groupModel')
const User = require('../models/userModel')
const Post = require('../models/postModel')
const generateSlug = require('../services/miscServices')

// @desc Create a new group under logged in user
// @route POST api/groups/create
// @access Private
const createGroup = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body
  const user = req.token?.id

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
  try {
    const group = await Group.create({
      name,
      description,
      image,
      uri,
      owner: user,
      members: [user]
    })

    // inserts group into user model
    const creator = await User.findById(user)
    creator.groups = [...creator.groups, group._id]
    console.log(group.posts)
    console.log('////////')
    console.log(group.members)
    creator.save()
    res.status(201).json(group)
  } catch (error) {
    console.log(error)
    res.status(400)
    throw new Error(error)
  }
})

// @desc Gets all groups
// @route GET api/groups/dev
// @access Dev
const getGroups = asyncHandler(async (req, res) => {
  const groups = await Group.find().populate({ path: 'owner', select: '-password' })
  res.status(200).json(groups)
})
// @desc Gets all data of a group
// @route GET api/groups/:uri
// @access Public
const returnGroup = asyncHandler(async (req, res) => {
  const { name, image, members, restricted } = req.data
  const token = req.token?.id
  const isMember = members.indexOf(token) !== -1

  // returns minimal data when group is restricted and user is not a member
  if (!restricted || isMember) {
    res.status(200).json(req.data)
  } else {
    res.status(401).json({
      name,
      image,
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
  try {
    if (token == owner) {
      // update only certain values to avoid overwriting members / posts list with bad request
      ['name', 'description', 'image', 'uri', 'restricted'].forEach(
        (key) => req.data[key] = req.body[key] || req.data[key])
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
// @route POST api/groups/join/:uri
// @access Private
const joinGroup = asyncHandler(async (req, res) => {
  const { _id: id, name, members, pendingMembers, restricted } = req.data
  const token = req.token.id

  if (members.indexOf(token) !== -1) {
    res.status(400)
    throw new Error('You are already in the group.')
  }
  // returns minimal data when group is restricted and user is not a member
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
  returnGroup,
  updateGroupDetails,
  joinGroup,
  deleteGroup
}