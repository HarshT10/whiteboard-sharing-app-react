const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors"); // Import the CORS middleware
const { addUser, removeUser, getUser } = require("../utils/users");

const app = express();

// Use CORS middleware
app.use(
  cors({
    origin: "https://your-frontend-domain.com", // Replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

const server = require("http").createServer(app);
const io = new Server(server);

let meetingCodeGlobal, imageURLGlobal;

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("userJoined", (data) => {
    const { name, meetingCode, userId, host, presenter } = data;

    meetingCodeGlobal = meetingCode;
    socket.join(meetingCode);
    const users = addUser({
      name,
      meetingCode,
      userId,
      host,
      presenter,
      socketId: socket.id,
    });

    socket.emit("userIsJoined", { success: true, users });

    socket.broadcast.to(meetingCode).emit("userJoinedMessage", name);

    socket.broadcast.to(meetingCode).emit("allUsers", users);

    socket.broadcast.to(meetingCode).emit("whiteBoardDataResponse", {
      imageURL: imageURLGlobal,
    });
  });

  socket.on("whiteBoardData", (data) => {
    imageURLGlobal = data;
    socket.broadcast.to(meetingCodeGlobal).emit("whiteBoardDataResponse", {
      imageURL: imageURLGlobal,
    });
  });

  socket.on("message", (data) => {
    const { message } = data;
    const user = getUser(socket.id);
    if (user) {
      socket.broadcast
        .to(meetingCodeGlobal)
        .emit("messageResponse", { message, name: user.name });
    }
  });

  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    if (user) {
      removeUser(socket.id);
      socket.broadcast.to(meetingCodeGlobal).emit("userLeftMessage", user.name);
    }
  });
});

// Export the serverless function
module.exports = (req, res) => {
  server.emit("request", req, res);
};
