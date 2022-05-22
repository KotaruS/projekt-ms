const express = require('express')
const router = express.Router()
const { createComment, returnComments, editComment, deleteComment } = require('../controllers/commentController')
const { requireToken, verifyToken } = require('../middleware/authMiddleware')
const { processURI } = require('../middleware/parseMiddleware')
const Post = require('../models/postModel')


router.post('/:uri', processURI(Post), requireToken, createComment)
router.get('/:uri', processURI(Post), verifyToken, returnComments)
router.put('/:id', requireToken, editComment)
router.delete('/:id', requireToken, deleteComment)

module.exports = router