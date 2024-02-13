import chalk from "chalk";
import { config } from "dotenv";
import express from "express";
import cors from "cors";
import database from "./utils/database.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRouter.js";
import http from "http";
import { Server } from "socket.io";

config();
database();
const PORT = process.env.PORT || 3001;
const Client = [
  "https://transponder-snail.vercel.app",
  "http://localhost:5173",
];
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: Client,
    methods: "*",
  },
});

app.use(cors({ origin: Client, methods: "*" }));
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

app.get("/", async (req, res) => {
  res.status(200).json({ status: 200 });
});

server.listen(PORT, () => {
  console.log(chalk.cyan(`[listen] ${PORT}`));
});

io.on("connection", (socket) => {
  console.log(chalk.cyan(`[socket] connected`));
  socket.on("setup", (user) => {
    socket.join(user._id);
    socket.emit("connected");
  });
  socket.on("join_chat", (room) => {
    socket.join(room);
    console.log("joinded", room._id);
  });
  socket.on("typing", (room, user) => {
    console.log(`${user.name} is typing`);
    room.users.map((sendTo) => {
      if (sendTo._id !== user._id) {
        socket.to(sendTo._id).emit("typing", user);
      }
    });
  });
  socket.on("stop_typing", (room, user) => {
    console.log(`${user.name} stopped typing`);
    room.users.map((sendTo) => {
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
        if (!(user._id == message.sender._id)) {
          socket.to(user._id).emit("message_recived", message);
        }
      });
    }
    socket.off("setup", () => {
      console.log("User Disconnected");
      socket.leave(user._id);
    });
  });
});
