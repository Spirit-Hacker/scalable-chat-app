import {Schema, Document, model} from "mongoose";

interface Message extends Document {
    content: String;
    sender?: String;
}

const messageSchema = new Schema<Message>({
    content: {
        type: String,
        required: true
    },
    sender: String
}, { timestamps: true });

const Message = model<Message>("Message", messageSchema);
export default Message;