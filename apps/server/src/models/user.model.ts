import { Schema, Document, model } from "mongoose";

interface User extends Document {
  name: string;
  email: string;
  provider: string;
  image?: string;
}

const userSchema = new Schema<User>(
  {
    name: String,
    email: String,
    provider: String,
    image: String,
  },
  { timestamps: true }
);

const User = model<User>("User", userSchema);
export default User;
