import { config } from "dotenv";
import chalk from "chalk";
import User from "../models/user.js";
import pkg from "bcryptjs";

config();
const { genSaltSync, hashSync, compareSync } = pkg;
const SALT = genSaltSync(Number(process.env.SALT));

const register = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields must be filled properly." });
    }

    const isExist = await User.findOne({ email });
    if (isExist) {
      return res
        .status(400)
        .json({ message: "User already exists, you can log in." });
    }

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
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: `${error.message}` });
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

const user = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.id }).select({ password: 0 });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.log(chalk.magenta(`[user] ${error.message}`));
    res.status(400).json({ message: error.message });
  }
};

export { register, login, user };
