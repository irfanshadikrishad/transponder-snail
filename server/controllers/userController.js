import chalk from "chalk";
import User from "../models/user.js";

const allUsers = async (req, res) => {
  try {
    const { search } = await req.query;
    const user = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    })
      .find({ _id: { $ne: req.id } }) // skipping currently logged in user
      .select({ password: 0 });
    if (user.length > 0) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "not found" });
    }
  } catch (error) {
    console.log(chalk.magenta(`[allUsers] ${error.message}`));
  }
};

const userCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.log(chalk.magenta(`[userCount] ${error.message}`));
  }
};

export { allUsers, userCount };
