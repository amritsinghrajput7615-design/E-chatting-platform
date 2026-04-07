const express = require('express')
const { body } = require('express-validator')
const userController = require('../controller/user.controller')
const userMiddileware = require('../middileware/user.middileware')

const router = express.Router()

router.post(
    '/register',
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters'),
    userController.registerUser
)

router.post(
    '/login',
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters'),
    userController.loginUser
)

router.get('/profile',userMiddileware,userController.profile)
router.post('/logout',userController.logout)
router.get('/all',userController.getallUsers)

module.exports = router