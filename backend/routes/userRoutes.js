const express = require('express')
const router = express.Router()
const { requireToken, verifyToken } = require('../middleware/authMiddleware')
const { processURI, devMiddleware } = require('../middleware/parseMiddleware')
const User = require('../models/userModel')
const {
  registerUser,
  loginUser,
  returnUser,
  userExists,
  getUser,
  getUsers,
  editUser,
  deleteUser,
} = require('../controllers/userController')

router.get('/', userExists)
router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/dev', devMiddleware, getUsers)

router.get('/me', requireToken, getUser)

router.route('/:uri')
  .get(processURI(User), verifyToken, returnUser)
  .put(processURI(User), requireToken, editUser)

// router.get('/:uri/groups', getUserGroups)

router.delete('/dev/:id', devMiddleware, deleteUser)

module.exports = router