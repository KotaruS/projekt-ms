const multer = require('multer')

// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const dir = path.resolve('backend', 'cdn')
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir);
//     }
//     cb(null, './backend')
//   },
//   filename: function (req, file, cb) {
//     cb(null, '/cdn/' + nanoid(8) + '_' + file.originalname)
//   }
// })
const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true)
  } else {
    cb(new Error('Provided file is not a image'), false)
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: multerFilter
})


module.exports = { upload }