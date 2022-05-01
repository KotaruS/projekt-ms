const asyncHandler = require('express-async-handler')
const Post = require('../models/postModel')
const User = require('../models/userModel')
const Comment = require('../models/commentModel')

// @desc Create a new comment under post
// @route POST api/comments/:posturi/create
// @access Private
const createComment = asyncHandler(async (req, res) => {
  const { comments } = req.data
  const { content, replyTo } = req.body
  const token = req.token.id

  req.data.comments = [...comments, { author: token, content, replyTo }]
  req.data.save()
  res.status(201).json(req.data.comments[req.data.comments.length - 1])
})

// @desc Get all comments under post
// @route GET api/comments/:uri - of the post
// @access Private/Public
const returnComments = asyncHandler(async (req, res) => {
  req.data.populate('comments')

  res.status(200).json(req.data)

})

// @desc Edit a comment
// @route PUT api/comments/:uri - of the comment
// @access Private
const editComment = asyncHandler(async (req, res) => {
  const unused = {}
  for (const key in req.body) {
    if (Object.hasOwnProperty.call(req.body, key)) {
      req.post[key] ? req.post[key] = req.body[key] : Object.assign(unused, { [key]: req.body[key] })
    }
  }
  await req.post.save()
  res.status(200).json({ newPost: req.post, invalidValues: unused })
})

// @desc deletes a comment
// @route DELETE api/comments/:uri
// @access Private
const deleteComment = asyncHandler(async (req, res) => {
  const post = await Post.updateOne({
    'comments': {
      $elemMatch: { '_id': req.params?.id, 'author': req.token?.id }
    }
  },
    {
      $pull: { 'comments': { '_id': req.params.id } }
    })
  res.status(200).json({
    message: `Deleted comment with ID ${req.params.id}`
  })
})

// @desc gets post by id and passes it into req.post
// @route middleware before api/posts/:id
// @access Private
const getPostById = asyncHandler(async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      console.log(req.params.id)
      res.status(400)
      throw new Error(`No post found under ID ${req.params.id}`)
    }
    req.post = post
  } catch {
    throw new Error('invalid ID')
  }
  next()
})

module.exports = { createComment, returnComments, editComment, deleteComment }