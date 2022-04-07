const express = require('express')
const router = express.Router()
const { requireToken, verifyToken } = require('../middleware/authMiddleware')
const { processURI, devMiddleware } = require('../middleware/parseMiddleware')
const Group = require('../models/groupModel')
const {
  createGroup,
  returnGroup,
  getGroups,
  updateGroupDetails,
  joinGroup,
  deleteGroup } = require('../controllers/groupController')

router.get('/dev', devMiddleware, getGroups)

router.post('/create', requireToken, createGroup)
router.post('/join/:uri', processURI(Group), requireToken, joinGroup)
router.route('/:uri')
  .get(processURI(Group), verifyToken, returnGroup)
  .put(processURI(Group), requireToken, updateGroupDetails)
  .delete(processURI(Group), requireToken, deleteGroup)
module.exports = router