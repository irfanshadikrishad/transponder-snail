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
      res.status(404).json({ message: "not found", search });
    }
  } catch (error) {
    console.log(chalk.magenta(`[allUsers] ${allUsers}`));
  }
};

export { allUsers };
