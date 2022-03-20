const express = require('express')
const router = express.Router()
const { getPostById, returnPosts, returnPost, createPost, editPost, deletePost } = require('../controllers/postController')

router.route('/')
.get(returnPosts)
.post(createPost)

router.route('/:id')
.get(getPostById, returnPost)
.put(getPostById, editPost)
.delete(getPostById, deletePost)


module.exports = router