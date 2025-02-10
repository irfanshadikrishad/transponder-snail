import { Schema, model, models } from "mongoose";
import pkg from "jsonwebtoken";

const { sign } = pkg;
const SECRET = process.env.SECRET as string;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: Object },
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

const User = models.User || model("User", userSchema);

export default User;
