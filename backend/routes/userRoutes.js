const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getUserData } = require('../controllers/userController')

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/:id', getUserData)

module.exports = router