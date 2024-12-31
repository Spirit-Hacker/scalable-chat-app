import { Schema, Document, model } from "mongoose";
import Message from "./message.model";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  fullName: string;
  username: string;
  email: string;
  password: string;
  messages: Message[];
  isOnline: boolean;
  profilePicture: string;
  refreshToken: string;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default:
        "https://t4.ftcdn.net/jpg/10/75/86/19/360_F_1075861908_Q2ZBfVQNvMSSzbZJCXwfu5Ew5CcfelrG.jpg",
      trim: true,
    },
    messages: [
      {
        ref: "Message",
        type: Schema.Types.ObjectId,
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET || "",
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET || "",
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const User = model<IUser>("User", userSchema);
export default User;
