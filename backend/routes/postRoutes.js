const express = require('express')
const router = express.Router()
const { requireToken, verifyToken } = require('../middleware/authMiddleware')
const { processURI, devMiddleware } = require('../middleware/parseMiddleware')
const Post = require('../models/postModel')
const {
  createPost,
  returnPost,
  getPosts,
  editPost,
  deletePost
} = require('../controllers/postController')

router.get('/dev', devMiddleware, getPosts)

router.post('/create', requireToken, createPost)

router.route('/:uri')
  .get(processURI(Post), verifyToken, returnPost)
  .put(processURI(Post), requireToken, editPost)
  .delete(processURI(Post), requireToken, deletePost)

module.exports = router