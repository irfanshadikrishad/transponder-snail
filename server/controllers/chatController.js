import chalk from "chalk";
import Chat from "../models/chat.js";
import User from "../models/user.js";

const getSingleChat = async (req, res) => {
  try {
    const { userId } = await req.body;
    if (!userId) {
      res.status(400).json({ message: "Chat id not porvided." });
    } else {
      let isChat = await Chat.find({
        isGroup: false,
        $and: [
          { users: { $elemMatch: { $eq: req.id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
        .populate("users", { password: 0 })
        .populate("latest");

      isChat = await User.populate(isChat, {
        path: "latest.sender",
        select: "name avatar email",
      });

      if (isChat.length > 0) {
        res.send(isChat[0]);
      } else {
        const createChat = await Chat.create({
          name: "sender", // might need to be fixed
          isGroup: false,
          users: [req.id, userId],
        });

        const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
          "users",
          { password: 0 }
        );

        res.status(200).json(fullChat);
      }
    }
  } catch (error) {
    console.log(chalk.magenta(`[getSingleChat] ${error.message}`));
    res
      .status(400)
      .json({ message: "Error from getSingleChat", error: error.message });
  }
};

const getAllChats = async (req, res) => {
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.id } },
    })
      .populate("users", { password: 0 })
      .populate("latest")
      .populate("isAdmin", { password: 0 })
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latest.sender",
      select: "name avatar email",
    });

    res.status(200).json(chats);
  } catch (error) {
    console.log(chalk.magenta(`[getAllChats] ${error.message}`));
    res
      .status(400)
      .json({ message: "Error from getAllChats", error: error.message });
  }
};

const createGroupChat = async (req, res) => {
  try {
    let users = await JSON.parse(req.body.users);
    if (users.length < 2) {
      res.status(400).json({ message: "Requires more than 2 users." });
    } else {
      await users.push(req.user);
      const groupChat = await Chat.create({
        name: req.body.name,
        users: users,
        isGroup: true,
        isAdmin: req.user,
      });

      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", { password: 0 })
        .populate("isAdmin", { password: 0 });

      res.status(201).json(fullGroupChat);
    }
  } catch (error) {
    console.log(chalk.magenta(`[createGroupChat] ${error.message}`));
    res
      .status(400)
      .json({ message: "Error from createGroupChat", error: error.message });
  }
};

const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = await req.body;
    const updatedChat = await Chat.findByIdAndUpdate(chatId, {
      $set: {
        name: chatName,
      },
    })
      .populate("users", { password: 0 })
      .populate("isAdmin", { password: 0 });

    res.status(200).json(updatedChat);
  } catch (error) {
    console.log(chalk.magenta(`[renameGroup] ${error.message}`));
    res
      .status(400)
      .json({ message: "Error from renameGroup", error: error.message });
  }
};

const addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = await req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", { password: 0 })
      .populate("isAdmin", { password: 0 });

    res.status(200).json(updatedChat);
  } catch (error) {
    console.log(chalk.magenta(`[addToGroup] ${error.message}`));
    res
      .status(400)
      .json({ message: "Error from addToGroup", error: error.message });
  }
};

const removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = await req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", { password: 0 })
      .populate("isAdmin", { password: 0 });

    res.status(200).json(updatedChat);
  } catch (error) {
    console.log(chalk.magenta(`[removeFromGroup] ${error.message}`));
    res
      .status(400)
      .json({ message: "Error from removeFromGroup", error: error.message });
  }
};

export {
  getSingleChat,
  getAllChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
