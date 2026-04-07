const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unquie:true
    },
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
})

const project = mongoose.model('project',projectSchema)
module.exports = project