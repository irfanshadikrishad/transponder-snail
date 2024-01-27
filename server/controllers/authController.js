import { config } from "dotenv";
import chalk from "chalk";
import User from "../models/user.js";
import pkg from "bcryptjs";

config();
const { genSaltSync, hashSync, compareSync } = pkg;
const SALT = genSaltSync(Number(process.env.SALT));

const register = async (req, res) => {
  try {
    const { name, email, password, avatar } = await req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields must filled properly." });
    } else {
      const isExist = await User.findOne({ email });
      if (isExist) {
        res
          .status(400)
          .json({ message: "User already exists, you can log in." });
      } else {
        const hashedPassword = hashSync(password, SALT);
        const user = new User({
          name,
          email,
          password: hashedPassword,
          avatar,
        });
        const savedUser = await user.save();
        res.status(201).json({
          id: savedUser._id,
          email: savedUser.email,
          token: savedUser.genJWT(),
        });
        console.log(chalk.cyan(`[register] ${savedUser._id} // registered`));
      }
    }
  } catch (error) {
    console.log(chalk.magenta(`[register] ${error.message}`));
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = await req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "Invalid Credentials!" });
    } else {
      const isVerified = compareSync(password, user.password);
      if (isVerified) {
        res.status(200).json({
          id: user._id,
          email: user.email,
          token: user.genJWT(),
        });
        console.log(chalk.cyan(`[login] ${user._id} // loggedIn`));
      } else {
        res.status(404).json({ message: "Invalid Credentials!" });
      }
    }
  } catch (error) {
    console.log(chalk.magenta(`[login] ${error.message}`));
  }
};

export { register, login };
