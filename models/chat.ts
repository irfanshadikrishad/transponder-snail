import { Schema, model, models } from "mongoose";
import "./message";

const chatSchema = new Schema(
  {
    name: {
      type: String,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latest: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    isAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Chat = models.Chat || model("Chat", chatSchema);

export default Chat;
