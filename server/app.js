import chalk from "chalk";
import { config } from "dotenv";
import express from "express";
import cors from "cors";
import database from "./utils/database.js";
import authRouter from "./routes/authRouter.js";

config();
database();
const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors({ origin: "http://localhost:5173", methods: "*" }));
app.use(express.json());
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(chalk.cyan(`[listen] ${PORT}`));
});
