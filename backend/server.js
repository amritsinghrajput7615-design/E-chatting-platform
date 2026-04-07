require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app');
const { connectDB } = require('./src/db/db');
const http = require('http');
const jwt = require('jsonwebtoken');
const projectModel = require('./src/models/project.model'); // ✅ FIX
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "frontend/dist")));

app.get((req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});

const io = require('socket.io')(server, {
  cors: {
    origin: "*",
  },
});

io.use(async (socket, next) => {
  try {
    // ✅ TOKEN FIRST
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    if (!token) return next(new Error("No token provided"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;

    // ✅ PROJECT ID
    const projectId = socket.handshake.query.projectId;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid projectId"));
    }

    const project = await projectModel.findById(projectId);

    if (!project) {
      return next(new Error("Project not found"));
    }

    socket.project = project;

    next();
  } catch (error) {
    next(error);
  }
});

io.on('connection', (socket) => {
  console.log("User connected:", socket.id);

  const roomId = socket.project._id.toString();

  socket.join(roomId);

  socket.on('project-message', (data) => {
    socket.broadcast.to(roomId).emit('project-message', data);
  });

  socket.on('disconnect', () => {
    console.log("User disconnected:", socket.id);
  });
});

connectDB().then(() => {
  console.log("PORT VALUE:", PORT);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});