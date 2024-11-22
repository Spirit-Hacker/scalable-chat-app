import { Schema, Document, model } from "mongoose";

interface IConversation extends Document {
  members: Schema.Types.ObjectId[];
  messages: Schema.Types.ObjectId[];
}

const conversationSchema = new Schema<IConversation>({
  members: [
    {
      ref: "User",
      type: Schema.Types.ObjectId,
    },
  ],
  messages: [
    {
      ref: "Message",
      type: Schema.Types.ObjectId,
      default: [],
    },
  ],
});

const Conversation = model<IConversation>("Conversation", conversationSchema);
export default Conversation;
