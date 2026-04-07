const projectModel = require('../models/project.model')
const mongoose = require('mongoose')
 const create=async({name,userId})=>{
    if (!name || !userId) {
        throw new Error('Name and userId are required')
    }
    const project = await projectModel.create({
        name,
        users:[userId]
    })
    return project
 }

 const getallprojectbyuserid=async(userId)=>{
    if (!userId) {
        throw new Error('userId is required')
    }
    const projects = await projectModel.find({
        users: userId
    })
    return projects
    }

    const addUsertoProjectServices = async ({ projectId, users, userId }) => {

    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!users) {
        throw new Error("users are required")
    }

    if (!Array.isArray(users) || users.some(id => !mongoose.Types.ObjectId.isValid(id))) {
        throw new Error("Invalid userId(s) in users array")
    }

    if (!userId) {
        throw new Error("userId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid userId")
    }

    // ✅ Check if current user belongs to project
    const project = await projectModel.findOne({
        _id: projectId,
        users: userId
    })

    if (!project) {
        throw new Error("User not belong to this project")
    }

    // ✅ FORCE users to array before update (safety fix)
    await projectModel.updateOne(
        { _id: projectId, users: { $type: "objectId" } },
        {
            $set: { users: [userId] }
        }
    )

    // ✅ Actual update
    const updatedProject = await projectModel.findOneAndUpdate(
        { _id: projectId },
        {
            $addToSet: {
                users: { $each: users }
            }
        },
        {
            returnDocument: 'after' // ✅ fixed warning
        }
    )

    return updatedProject
}
    module.exports = {
    create,
    getallprojectbyuserid,
    addUsertoProjectServices

}