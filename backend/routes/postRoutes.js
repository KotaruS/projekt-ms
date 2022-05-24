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
const { upload } = require('../middleware/fileMiddleware')

router.get('/', verifyToken, getPosts)

router.post('/create', requireToken, upload.single('image'), createPost)

router.route('/:uri')
  .get(processURI(Post), verifyToken, returnPost)
  .put(processURI(Post), requireToken, upload.single('image'), editPost)
  .delete(processURI(Post), requireToken, deletePost)

module.exports = router