import chalk from "chalk";
import { config } from "dotenv";
import express from "express";
import cors from "cors";
import database from "./utils/database.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRouter.js";

config();
database();
const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors({ origin: "http://localhost:5173", methods: "*" }));
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

app.listen(PORT, () => {
  console.log(chalk.cyan(`[listen] ${PORT}`));
});
