const asyncHandler = require('express-async-handler')
const path = require('path')
const multer = require('multer')
const { nanoid } = require('nanoid')

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'cdn/'));
  },
  filename: function (req, file, cb) {
    cb(null, nanoid(8) + '_' + file.originalname)
  }
})
const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new Error('Provided file is not a image'), false);
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

const uploadFile = name => upload.single(name)

module.exports = { uploadFile }