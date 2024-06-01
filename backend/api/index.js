const { Server } = require("socket.io");
const { createServer } = require("http");

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    const httpServer = createServer();
    const io = new Server(httpServer, {
      path: "/api/socketio",
    });

    io.on("connection", (socket) => {
      console.log("New client connected");

      socket.on("drawing", (data) => {
        socket.broadcast.emit("drawing", data);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Socket.io server already running...");
  }
  res.end();
};

module.exports = ioHandler;
