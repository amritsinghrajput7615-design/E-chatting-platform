const mongoose = require('mongoose')

async function connectDB(){
    const uri = process.env.MONGO_URI 
    try{
        await mongoose.connect(uri)
        console.log('Connected to MongoDB')
    }catch(err){
        console.error('MongoDB connection error:', err.message)
        process.exit(1)
    }
}

module.exports = { connectDB }
