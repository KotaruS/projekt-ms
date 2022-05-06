const express = require('express')
const router = express.Router()
const { requireToken, verifyToken } = require('../middleware/authMiddleware')
const { processURI, devMiddleware } = require('../middleware/parseMiddleware')
const { upload } = require('../middleware/fileMiddleware')
const Group = require('../models/groupModel')
const {
  createGroup,
  returnGroup,
  groupExists,
  getGroups,
  updateGroupDetails,
  joinGroup,
  deleteGroup } = require('../controllers/groupController')

router.get('/dev', devMiddleware, getGroups)
router.get('/', groupExists)

router.post('/create', requireToken, upload.single('image'), createGroup)
router.get('/join/:uri', processURI(Group), requireToken, joinGroup)
router.route('/:uri')
  .get(processURI(Group), verifyToken, returnGroup)
  .put(processURI(Group), upload.single('image'), requireToken, updateGroupDetails)
  .delete(processURI(Group), requireToken, deleteGroup)
module.exports = router