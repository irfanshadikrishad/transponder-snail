import { config } from "dotenv";
import { Schema, model } from "mongoose";
import pkg from "jsonwebtoken";

config();
const { sign } = pkg;
const SECRET = process.env.SECRET;

const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: {
      type: Object,
    },
  },
  { timestamps: true }
);

userSchema.methods.genJWT = function () {
  return sign(
    {
      id: this._id,
      email: this.email,
    },
    SECRET,
    { expiresIn: "30d" }
  );
};

const User = model("User", userSchema);

export default User;
