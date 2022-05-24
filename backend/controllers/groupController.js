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


// @desc Gets all groups
// @route GET api/groups/
// @access Public
const returnGroups = asyncHandler(async (req, res) => {
  const search = req.query?.search
  const condition = search ? { 'name': search } : {}
  try {
    const groups = await Group.find(condition)
    res.status(200).json(groups)
  } catch (error) {
    res.status(400)
    throw new Error(error)
  }
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


// @desc Gets all (pending)members of a group
// @route GET api/groups/members/:uri
// @access Public
const returnGroupMembers = asyncHandler(async (req, res) => {
  const { members, owner, restricted } = req.data
  const token = req.token?.id
  const isMember = members.indexOf(token) !== -1
  if ((restricted && !isMember) || (req.query?.pendingList && token != owner)) {
    res.status(403)
    throw new Error('You don\'t have permissions to get group information')
  }
  try {
    let memberData
    if (req.query?.pendingList) {
      md = await req.data.populate('pendingMembers', '-password')
      memberData = md.pendingMembers
    } else {
      md = await req.data.populate('members', '-password')
      memberData = md.members
    }
    res.status(200).json(memberData)

  } catch (error) {
    throw new Error('Unable to retrieve members list')
  }
})

// @desc Update group member from pending or normal list
// @route PUT api/groups/members/:uri
// @access Private
const updateGroupMembers = asyncHandler(async (req, res) => {
  const { _id: id, name, members, pendingMembers, owner, } = req.data
  const token = req.token?.id

  if (req.body?.accept == token
    || req.body?.decline == token
    || req.body?.kick == token
    || req.body?.newOwner == token) {
    res.status(400)
    throw new Error('You cannot perform that action on yourself')
  }

  try {
    if (token == owner) {
      // when new user is accepted from pending members list
      if (req.body?.accept) {
        req.data.pendingMembers = pendingMembers.filter(member => member?._id != req.body?.accept)
        req.data.members = [...members, req.body?.accept]
        req.data.save()
        const user = await User.findById(req.body?.accept)
        user.groups = [...user.groups, id]
        user.save()
        res.status(200).json({ message: `Accepted ${user.name} as a member of ${name}` })
        // when new user is declined from pending members list
      } else if (req.body?.decline) {
        // removes the user from the list
        req.data.pendingMembers = pendingMembers.filter(member => member?._id != req.body?.decline)
        req.data.save()
        res.status(200).json({ message: 'Removed user from waiting list' })
        // when new user is kicked by owner from members list
      } else if (req.body?.kick) {
        req.data.members = members.filter(member => member?._id != req.body?.kick)
        req.data.save()
        const user = await User.findById(req.body?.kick)
        await User.updateOne({ _id: req.body?.kick }, { $pull: { groups: id } })
        res.status(200).json({ message: `Kicked member ${user.name}` })
        // when new user is transfered ownership by current owner
      } else if (req.body?.newOwner) {
        const user = await User.findById(req.body?.newOwner)
        req.data.owner = req.body?.newOwner
        req.data.save()
        res.status(200).json({ message: `Transfered ownership to ${user.name}` })
      }
    } else {
      res.status(403)
      throw new Error('You do not have permission to perform this action')
    }
  } catch (err) {
    res.status(400)
    throw new Error(err)
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
    res.status(400)
    throw new Error('Could not update group details')
  }
})

// @desc Join group 
// @route GET api/groups/join/:uri
// @access Private
const joinGroup = asyncHandler(async (req, res) => {
  const { _id: id, name, members, pendingMembers, restricted } = req.data
  const token = req.token?.id
  const isPendingMember = pendingMembers.indexOf(token) !== -1

  if (members.indexOf(token) !== -1) {
    res.status(400)
    throw new Error('You are already in the group.')
  }

  if (isPendingMember) {
    res.status(400)
    throw new Error('You are already in the waiting list')
  }

  try {
    if (restricted) {
      req.data.pendingMembers = [...pendingMembers, token]
      req.data.save()
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
  returnGroups,
  returnGroupMembers,
  updateGroupMembers,
  updateGroupDetails,
  joinGroup,
  leaveGroup,
  deleteGroup
}