import Chat from "../models/chat.js";
import User from "../models/user.js";

const getSingleChat = async (req, res) => {
  const { userId } = await req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.status(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    try {
      const createdChat = await Chat.create({
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      });
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
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
    res
      .status(400)
      .json({ message: "Error getting chats.", error: error.message });
  }
};

const createGroupChat = async (req, res) => {
  try {
    let users = await req.body.users;
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
    res
      .status(400)
      .json({ message: "Error creating group chat.", error: error.message });
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
    res
      .status(400)
      .json({ message: "Error renaming group.", error: error.message });
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
    res
      .status(400)
      .json({ message: "Error adding to the group.", error: error.message });
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
    res
      .status(400)
      .json({ message: "Error removing from group.", error: error.message });
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
