const express = require("express");
const app = express();

const server = require("http").createServer(app);
const { Server } = require("socket.io");
const { addUser, removeUser, getUser } = require("./utils/users");
const { disconnect } = require("process");

const io = new Server(server);

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("this is mern");
});

let meetingCodeGlobal, imageURLGlobal;

io.on("connection", (socket) => {
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

server.listen(port, () => {
  console.log("server is running on http://localhost:5000");
});
