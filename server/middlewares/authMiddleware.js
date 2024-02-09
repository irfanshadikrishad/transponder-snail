import { config } from "dotenv";
import chalk from "chalk";
import User from "../models/user.js";
import pkg from "jsonwebtoken";

config();
const SECRET = process.env.SECRET;
const { verify } = pkg;

const authMiddleware = async (req, res, next) => {
  try {
    const authorization = await req.header("Authorization");
    const token = await authorization.split(" ")[1];
    const isVerified = verify(token, SECRET);
    if (!token || !isVerified) {
      res.status(401).json({ message: "Unauthorized! Access Denied." });
    } else {
      const user = await User.findOne({ email: isVerified.email }).select({
        password: 0,
      });
      req.user = user;
      req.id = user._id.toString();
      req.token = token;

      console.log(chalk.cyan(`[authMiddleware] ✅ ${req.user.name}`));
      next();
    }
  } catch (error) {
    console.log(chalk.magenta(`[authMiddleware] ${error.message}`));
    res.status(401).json({ message: "Unauthorized! Access Denied.", error });
  }
};

export default authMiddleware;
