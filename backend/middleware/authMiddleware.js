const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const requireToken = asyncHandler(async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decodedToken = jwt.verify(token, process.env.JWT_CODE)
      req.token = decodedToken
      next()
    }
    catch (error) {
      res.status(400)
      throw new Error('Invalid user token')
    }
  } else {
    res.status(401)
    throw new Error('No token')
  }
})

const verifyToken = asyncHandler(async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1]
      const decodedToken = jwt.verify(token, process.env.JWT_CODE)
      req.token = decodedToken
      next()
    }
    catch (error) {
      res.status(400)
      throw new Error('Invalid user token')
    }
    // continue even if there is no token provided
  } else {
    next()
  }
})

module.exports = { requireToken, verifyToken }