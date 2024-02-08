import Message from "../models/message.js";
import User from "../models/user.js";
import Chat from "../models/chat.js";

const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = await req.body;
    if (!chatId || !content) {
      res.status(404).json({ error: "chatId or message missing" });
    } else {
      let message = await Message.create({
        sender: req.id,
        content,
        chat: chatId,
      });
      console.log(message);
      message = await message.populate("sender", "name avatar");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name avatar email",
      });

      await Chat.findByIdAndUpdate(chatId, {
        latest: message,
      });

      res.status(200).json(message);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSingleChat = async (req, res) => {
  try {
    const chatId = await req.params.chatId;
    const message = await Message.find({ chat: chatId })
      .populate("sender", "name avatar email")
      .populate("chat");
    if (message.length <= 0) {
      res.status(404).json({ error: "message not found", chatId });
    } else {
      res.status(200).json(message);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export { sendMessage, getSingleChat };
