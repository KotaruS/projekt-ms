const express = require('express')
const router = express.Router()
const { getPosts, createPost, editPost, deletePost } = require('../controllers/postController')

router.route('/')
.get(getPosts)
.post(createPost)

router.route('/:id')
.put(editPost)
.delete(deletePost)


module.exports = router