const asyncHandler = require('express-async-handler')

const processURI = (model) => {
  return asyncHandler(async (req, res, next) => {
    try {
      const data = await model.findOne({ uri: req.params.uri })
      if (!data) {
        res.status(404)
        throw new Error('Invalid URL address')
      }
      req.data = data
    } catch {
      res.status(404)
      throw new Error('Invalid URL address')
    }
    next()
  })
}

const devMiddleware = (req, res, next) => {
  if (process.env.NODE_ENV === 'developement') {
    next()
  } else {
    res.status(404).json({ message: 'No resource' })
  }
}

module.exports = { processURI, devMiddleware } 