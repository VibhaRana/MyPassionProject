 const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const postController = require('./controllers/postController')
//user related routes
router.get('/', userController.home)
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)

//profile related routes
router.get('/profile/:username', userController.ifUserExists, userController.profilePostsScreen)

//post related routes
//only users who have a account can create a post, no guest user can. You should register first
router.get('/create-post', userController.mustBeLoggedIn, postController.viewCreateScreen)
router.post('/create-post', userController.mustBeLoggedIn, postController.create)
router.get('/post/:id', postController.viewSingle)
router.get('/post/:id/edit', postController.viewEditScreen)
module.exports = router
//color for body background #ff4c68