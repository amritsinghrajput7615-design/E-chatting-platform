const dotenv = require('dotenv')
dotenv.config()
const express = require('express');
const userRoutes = require('./routers/user.router')
const cookie = require('cookie-parser')
const projectRoutes = require('./routers/project.router')
const app = express()
const cors = require('cors')

app.use(cors({
  origin: "e-chatting-platform-frontend2.vercel.app",
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookie())
app.use('/user', userRoutes)
app.use('/project', projectRoutes)
module.exports = app