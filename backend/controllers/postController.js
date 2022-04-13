const asyncHandler = require('express-async-handler')
const Group = require('../models/groupModel')
const Post = require('../models/postModel')
const User = require('../models/userModel')
const generateSlug = require('../services/miscServices')

// @desc Create a new post
// @route POST api/posts/create
// @access Private
const createPost = asyncHandler(async (req, res) => {
  const author = req.token?.id
  const { title, content, group } = req.body
  const uri = await generateSlug(2, title, Post)
  if (!title || !content || !uri || !group || !author) {
    res.status(400)
    throw new Error('Please provide all data')
  }
  const memberOfGroup = await User.findOne({ $and: [{ '_id': author }, { groups: group }] })
  if (!memberOfGroup) {
    res.status(403)
    throw new Error('You must be member of the group in order to create post in it.')
  }
  try {
    const post = await Post.create({
      title,
      content,
      uri,
      author,
      group,
    })
    const groupOfPost = await Group.findById(group)
    // insert post id into group's posts list
    groupOfPost.posts = [...groupOfPost.posts, post._id]
    groupOfPost.save()
    // insert post id into user's posts list
    memberOfGroup.posts = [...memberOfGroup.posts, post._id]
    memberOfGroup.save()
    res.status(201).json(post)
  } catch {
    res.status(400)
    throw new Error('Please provide all necessary data')
  }
})


// @desc Gets posts of user X in Y group
// @route GET api/posts/:uri
// @access Public/Private
const returnPost = asyncHandler(async (req, res) => {
  const { _id: id, title, author, restricted } = req.data
  const token = req.token?.id
  // only the author can view restricted posts
  if (restricted && (token != author)) {
    res.status(404)
    throw new Error('Post not found')
  }
  const postGroup = await Group.findOne({ posts: id })
  const isMemberOfGroup = postGroup.members.indexOf(token) !== -1
  // returns minimal data when group is set to restricted and user is not a member
  if (!postGroup?.restricted || isMemberOfGroup) {
    res.status(200).json(req.data)
  } else {
    res.status(401).json({
      title,
    })
  }
})

// @desc Gets all posts
// @route GET api/posts
// @access Private
const getPosts = asyncHandler(async (req, res) => {
  // throw new Error("Hey, not to disturb you or anything, but something went wrong.")
  const posts = await Post.find().populate('author', 'name image uri').populate('group', 'name uri image')
  res.status(200).json(posts)

})

// @desc Edits a post
// @route PUT api/posts/:uri
// @access Private
const editPost = asyncHandler(async (req, res) => {
  const { title, author, uri } = req.data
  req.body.uri = (title === req.body.title || !req.body.title) ? uri : await generateSlug(2, req.body.title, Post)
  const token = req.token?.id
  try {
    if (token == author) {
      ['title', 'content', 'uri', 'restricted'].forEach(
        (key) => req.data[key] = req.body[key] || req.data[key])
      await req.data.save()
      res.status(200).json(req.data)
    } else {
      res.status(403)
      throw new Error('Unauthorized user')
    }
  } catch {
    res.status(400)
    throw new Error('Could not update post')
  }
})

// @desc Deletes a post
// @route DELETE api/posts/:uri
// @access Private
const deletePost = asyncHandler(async (req, res) => {
  const { _id: id, title, author, group } = req.data
  const token = req.token?.id
  try {
    if (token == author) {
      req.data.remove()
      // removes post from the group's posts list
      await Group.updateOne({ '_id': group }, { $pull: { posts: id } })
      // removes post from the user's posts list
      await User.updateOne({ '_id': author }, { $pull: { posts: id } })
      res.status(200).json({ message: `Succesfully deleted post ${title}` })
    }
  } catch {
    res.status(404)
    throw new Error('Could not delete post')
  }
})

module.exports = {
  createPost,
  returnPost,
  getPosts,
  editPost,
  deletePost
}