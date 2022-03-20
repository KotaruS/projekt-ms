const asyncHandler = require('express-async-handler')
const { find } = require('../models/postModel')
const Post = require('../models/postModel')

// @desc Gets all posts
// @route GET api/posts
// @access Private
const returnPosts = asyncHandler(async (req, res) => {
  // throw new Error("Hey, not to disturb you or anything, but something went wrong.")
  const posts = await Post.find()
  res.status(200).json(posts)

})

// @desc Gets posts of an user
// @route GET api/posts/:id
// @access Private
const returnPost = asyncHandler(async (req, res) => {
  res.status(200).json(req.post)

})

// @desc Create a new post
// @route GET api/posts
// @access Private
const createPost = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(400)
    throw new Error('Please provide all data')
  }
  const post = await Post.create(req.body)
  res.status(201).json(post)


})

// @desc Edits a post
// @route GET api/posts/:id
// @access Private
const editPost = asyncHandler(async (req, res) => {
  for (const key in req.body) {
    if (Object.hasOwnProperty.call(req.body, key)) {
      req.post[key] = req.body[key];
    }
  }
  await req.post.save()
  res.status(200).json([req.body, req.post])
})

// @desc deletes a post of an user
// @route GET api/posts/:id
// @access Private
const deletePost = asyncHandler(async (req, res) => {
  req.post.remove()
  res.status(200).json({
    message: `Deleted  post with ID ${req.params.id}`
  })
})

const getPostById = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
  if (!post) {
    res.status(400)
    throw new Error(`No post found under ID ${req.params.id}`)
  }
  req.post = post
  next()
})

module.exports = { getPostById, returnPosts, returnPost, createPost, editPost, deletePost }