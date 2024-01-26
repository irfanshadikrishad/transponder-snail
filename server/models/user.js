import { Schema, model } from "mongoose";

const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      required: true,
      default:
        "https://i.pinimg.com/564x/dd/1d/e6/dd1de6d91467f98928ede3a7798dbb23.jpg",
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
