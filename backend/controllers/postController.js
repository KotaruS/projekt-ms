const asyncHandler = require('express-async-handler')

// @desc Gets posts of an user
// @route GET api/posts
// @access Private
const getPosts = asyncHandler(async (req, res) => {
    // throw new Error("Hey, not to disturb you or anything, but something went wrong.")
    res.status(200).json({
        message: 'Hello world'
    })
    

})

// @desc Create a new post
// @route GET api/posts
// @access Private
const createPost = asyncHandler(async (req, res) => {
    console.log(req.body)
    if (!req.body.name) {
        res.status(400)
        throw new Error('Please provide all data')
    }
    res.status(200).json({
        message: 'Created new post',
        values: req.body
    })


})

// @desc Edits a post
// @route GET api/posts/:id
// @access Private
const editPost = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: `Updated post ${req.params.id}`
    })
})

// @desc deletes a post of an user
// @route GET api/posts/:id
// @access Private
const deletePost = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: `Deleted post ${req.params.id}`
    })
})


module.exports = { getPosts, createPost, editPost, deletePost }