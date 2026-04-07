const userModel = require('../models/user.model')
const userService = require('../services/user.service')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')

async function registerUser(req,res){
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        })
    }
try {
    const user = await userService.create(req.body)

    const token = await user.generateJWT()
    // set httpOnly cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000 // 1 hour
    })
    res.status(201).json({
        message: 'User registered successfully',
        user: user,
        token: token
    })


} catch (error) {
    res.status(500).json({
        message:'Error registering user',
        error:error.message
    })
}

}

async function loginUser(req,res){
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }

        const isValid = await bcrypt.compare(password,user.password)
        if(!isValid){
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const token = user.generateJWT()
       
        console.log(user)
        return res.status(200).json({ user, token })

    } catch (error) {
        return res.status(500).json({ message: 'Error logging in', error: error.message })
    }
}
async function profile(req,res) {
    try{
        const user = await userModel.findById(req.user.id).select('-password')
        if(!user) return res.status(404).json({ message: 'User not found' })
        return res.status(200).json({ user })
    }catch(error){
        return res.status(500).json({ message: 'Error fetching profile', error: error.message })
    }
}
async function logout(req,res){
    const authHeader = req.headers['authorization'] || req.header && req.header('Authorization')
    const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null
    let tokenFromCookie = null
    if(req.headers.cookie){
        const match = req.headers.cookie.split(';').map(c=>c.trim()).find(c=>c.startsWith('token='))
        if(match) tokenFromCookie = match.split('=')[1]
    }

    // clear cookie
    res.clearCookie('token', { path: '/' })
    return res.status(200).json({ message: 'User logged out successfully' })
}
async function getallUsers(req,res){
    try {
        const users = await userModel.find().select('-password')
        return res.status(200).json({ users })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Error fetching users', error: error.message })
    }
}
module.exports={
    registerUser,
    loginUser,
    profile,
    logout,
    getallUsers
}