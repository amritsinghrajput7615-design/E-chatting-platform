const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')

async function create({ email, password }){
    if(!email || !password){
        throw new Error('Email and password are required')
    }
    try{
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await userModel.create({
            email,
            password: hashedPassword
        })
        return user
    }catch(error){
        throw error
    }
}
module.exports ={
    create
}