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
  deleteGroup,
  leaveGroup,
  returnGroupMembers,
  updateGroupMembers,
  returnGroups } = require('../controllers/groupController')

router.get('/', verifyToken, returnGroups)
router.get('/dev', devMiddleware, getGroups)
router.get('/check', groupExists)

router.post('/create', requireToken, upload.single('image'), createGroup)
router.get('/join/:uri', processURI(Group), requireToken, joinGroup)
router.get('/leave/:uri', processURI(Group), requireToken, leaveGroup)

router.get('/members/:uri', processURI(Group), verifyToken, returnGroupMembers)
router.put('/members/:uri', processURI(Group), requireToken, updateGroupMembers)

router.route('/:uri')
  .get(processURI(Group), verifyToken, returnGroup)
  .put(processURI(Group), requireToken, upload.single('image'), updateGroupDetails)
  .delete(processURI(Group), requireToken, deleteGroup)
module.exports = router