const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    }
})
userSchema.statics.hashpassword = async function (password){
    return await bcrypt.hash(password ,10)
}



userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateJWT = function (){
    const secret = process.env.JWT_SECRET || 'secret'
    return jwt.sign({ email: this.email, id: this._id }, secret, { expiresIn: '1d' })
}

const User = mongoose.model('User', userSchema)
module.exports = User