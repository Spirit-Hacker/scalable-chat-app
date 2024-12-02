import { Schema, Document, model } from "mongoose";

interface Message extends Document {
  content: string;
  sender: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
  isDelivered: boolean;
  messageId: string;
}

const messageSchema = new Schema<Message>(
  {
    content: {
      type: String,
      required: true,
    },
    sender: {
      ref: "User",
      type: Schema.Types.ObjectId,
      required: true,
    },
    receiver: {
      ref: "User",
      type: Schema.Types.ObjectId,
      required: true,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    messageId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Message = model<Message>("Message", messageSchema);
export default Message;
