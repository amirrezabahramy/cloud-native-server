const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const app = express();

app.get("/", function (req, res) {
  res.send(
    `App is running on port: ${APP_PORT} and hostname: ${APP_HOSTNAME}.`
  );
});

// Core middlewares
app.use(express.json());
app.use(cors());

// Socket
const server = require("http").createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// .use(function (socket, next) {
//   if (socket.handshake.query && socket.handshake.query.token) {
//     jwt.verify(
//       socket.handshake.query.token,
//       "SECRET_KEY",
//       function (err, decoded) {
//         if (err) return next(new Error("Authentication error"));
//         socket.decoded = decoded;
//         next();
//       }
//     );
//   } else {
//     next(new Error("Authentication error"));
//   }
// })

io.on("connect", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("end_call", () => {
    socket.broadcast.emit("call_ended");
  });

  socket.on("my_id", () => {
    socket.emit("your_id", socket.id);
  });

  socket.on("call_user", (data) => {
    io.to(data.userToCall).emit("call_user", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
      isVideoCall: data.isVideoCall,
    });
  });

  socket.on("answer_call", (data) => {
    io.to(data.to).emit("call_accepted", data.signal);
  });

  socket.on("join_room", (data) => {
    let rooms = io.sockets.adapter.rooms;
    let room = rooms.get(data);
    console.log(room);
    if (room && room.size > 2) {
      socket.emit("permitted", { status: false });
    } else {
      socket.emit("permitted", { status: true });
    }
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.roomId).emit("receive_message", data);
  });
});

// Router
app.use("/api/v1", require("./src/routes"));

dotenv.config();
// Db start
const { MONGODB_URI } = process.env;
mongoose.connect(MONGODB_URI).then(function () {
  console.log(`Connected to ${MONGODB_URI}.`);
});

// App start
const { APP_PORT, APP_HOSTNAME } = process.env;
app.listen(APP_PORT, APP_HOSTNAME, function () {
  console.log(
    `App started on port: ${APP_PORT} and hostname: ${APP_HOSTNAME}.`
  );
});

// Socket io server start
const { SOCKET_IO_PORT } = process.env;
server.listen(SOCKET_IO_PORT, APP_HOSTNAME, function () {
  console.log(
    `Socket io server is running on port: ${SOCKET_IO_PORT} and hostname: ${APP_HOSTNAME}.`
  );
});
