import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const PORT = process.env.PORT || 3001;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://transponder-snail.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: ["https://transponder-snail.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ status: 200 });
});

io.on("connection", (socket) => {
  console.log(`[socket] connected`);

  socket.on("setup", (user) => {
    socket.join(user._id);
    socket.emit("connected");
  });

  socket.on("join_chat", (room) => {
    socket.join(room);
    console.log("joined", room._id);
  });

  socket.on("typing", (room, user) => {
    console.log(`${user.name} is typing`);
    room.users.forEach((sendTo) => {
      if (sendTo._id !== user._id) {
        socket.to(sendTo._id).emit("typing", user);
      }
    });
  });

  socket.on("stop_typing", (room, user) => {
    console.log(`${user.name} stopped typing`);
    room.users.forEach((sendTo) => {
      if (sendTo._id !== user._id) {
        socket.to(sendTo._id).emit("stop_typing", user);
      }
    });
  });

  socket.on("send_message", (message) => {
    let chat = message.chat;
    if (!chat.users) {
      return console.log("no users");
    } else {
      chat.users.forEach((user) => {
        if (user._id !== message.sender._id) {
          socket.to(user._id).emit("message_received", message);
        }
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`[listen] ${PORT}`);
});
