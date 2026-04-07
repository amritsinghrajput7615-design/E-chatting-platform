
const projectController = require('../controller/project.controller')
const express = require('express')
const router = express.Router();
const { body } = require('express-validator');
const userMiddileware = require('../middileware/user.middileware');

router.post('/create',userMiddileware,
    body('name').notEmpty().withMessage('Name is required'),
    projectController.projectCreate
)
router.get('/all',userMiddileware,projectController.getallproject)

router.put('/add-user',
    userMiddileware,
    body('projectId').isString().withMessage('Project ID is required'),
    body('users').isArray({ min: 1 }).withMessage('Users must be an array of strings').bail()
        .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string'),
    projectController.addUsertoProject
)
router.get('/get-project/:projectId',userMiddileware,projectController.getProjectbyId)
module.exports = router