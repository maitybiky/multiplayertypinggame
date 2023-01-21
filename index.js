const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 4000;
let users;
let result;
const app = express();
const server = http.createServer(app);
// const io = socketio(server);
const io = new Server(server, {
  cors: {
    origin: "https://incandescent-halva-7330f8.netlify.app",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("connected +" + socket.id);
  socket.emit("joined-user", users);
  socket.on("join_room", (data) => {
    users = data.location;
    console.log(users, "kk");
    socket.broadcast.emit("join-alert", data);
  });
  socket.on("ready", () => {
    socket.broadcast.emit("opponent_ready");
  });
  socket.on("typing", (typeData) => {
    // console.log("typeData", typeData);
    socket.broadcast.emit("remoteType", typeData);
    // io.to(userData.room).emit("location_up", locData);
  });
  socket.on("result", (resultData) => {
    result = resultData;
    console.log(result)
    socket.broadcast.emit("remoteResult", resultData);
    result = null;
    // io.to(userData.room).emit("location_up", locData);
  });

  socket.on("disconnect", (socket) => {
    users = {};
    //  socket.broadcast.emit("userLeft");
    console.log("connected -");
  });
});

server.listen(PORT, "0.0.0.0", () =>
  console.log(`server running on port ${PORT}`)
);
