const {validationResult} = require('express-validator')
const projectModel = require('../models/project.model')
const userModel = require('../models/user.model')
const projectService = require('../services/project.service')
const mongoose = require('mongoose')
async function projectCreate(req,res){
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        })}
        try {
            const { name } = req.body
        const loggedInUser = await userModel.findOne({ email: req.user.email })
        if (!loggedInUser) {
            return res.status(404).json({ message: 'User not found' })
        }
        const userId = loggedInUser._id

        const project = await projectService.create({name,userId})
        res.status(201).json({
            message:'project created successfully',
            project:project
        })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message:'Internal server error'
            })
        }
        
}

async function getallproject(req,res) {
    try {
        const loggedInUser = await userModel.findOne({
            email:req.user.email
        })
       const projects = await projectService.getallprojectbyuserid(loggedInUser._id)
        res.status(200).json({
            projects:projects
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:'Internal server error'
        })
    }
    
}
async function getProjectbyId(req, res) {
    try {
        const { projectId } = req.params // ✅ use params

        // ✅ validation
        if (!projectId) {
            return res.status(400).json({
                message: "projectId is required"
            })
        }

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                message: "Invalid projectId"
            })
        }

        const project = await projectModel
        .findById(projectId)
        .populate("users", "email name")

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            })
        }

        return res.status(200).json({
            project
        })

    } catch (error) {
        console.error(error)

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}


async function addUsertoProject(req, res) {
    const error = validationResult(req)

    if (!error.isEmpty()) {
        return res.status(400).json({
            errors: error.array()
        })
    }

    try {
        const { projectId, users } = req.body

        const loggedInUser = await userModel.findOne({ email: req.user.email })

        const project = await projectService.addUsertoProjectServices({
            projectId,
            users,
            userId: loggedInUser._id   // ✅ FIX HERE
        })

        if (!project) {
            return res.status(404).json({
                message: 'Project not found or you do not have permission'
            })
        }

        return res.status(200).json({
            message: "Users added successfully",
            project
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}
module.exports = {
    projectCreate,
    getallproject,
    addUsertoProject,
    getProjectbyId
}