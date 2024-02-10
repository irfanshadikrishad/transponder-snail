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
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: "*",
  },
});

app.use(cors({ origin: "http://localhost:5173", methods: "*" }));
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

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
  socket.on("send_message", (message) => {
    let chat = message.chat;
    if (!chat.users) {
      return console.log("no users");
    } else {
      chat.users.forEach((user) => {
        if (!(user._id == message.sender._id)) {
          console.log("backend ran for message recived");
          socket.to(user._id).emit("message_recived", message);
        }
      });
    }
  });
});
