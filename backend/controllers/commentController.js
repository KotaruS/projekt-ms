const asyncHandler = require('express-async-handler')
const Post = require('../models/postModel')

// @desc Create a new comment under post
// @route POST api/comments/:posturi
// @access Private
const createComment = asyncHandler(async (req, res) => {
  const { comments } = req.data
  const { content } = req.body
  const token = req.token.id

  req.data.comments = [...comments, { author: token, content }]
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
// @route PUT api/comments/:id - of the comment
// @access Private
const editComment = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findOne({
      'comments': {
        $elemMatch: { '_id': req.params?.id, 'author': req.token?.id }
      }
    })
    const index = post.comments.findIndex(comment => comment._id == req.params?.id)
    if (index === -1) {
      res.status(400)
      throw new Error('No such comment found')
    }
    Object.assign(post.comments[index], { content: req.body.content })

    await post.save()
    res.status(200).json(post)
  } catch (error) {
    res.status(400)
    throw new Error('Comment update failed')
  }
})

// @desc deletes a comment
// @route DELETE api/comments/:id - of the comment
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
  if (post) {
    res.status(200).json({ message: `Deleted comment with ID ${req.params.id}` })
  } else {
    res.status(400)
    throw new Error('Comment cannot be deleted')
  }
})


module.exports = { createComment, returnComments, editComment, deleteComment }