export interface Message {
  _id: string;
  content: string;
  isDelivered: boolean;
  sender: string;
  receiver: string;
  messageId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MessageWS {
  message: string;
  senderId: string;
  receiverId: string;
  isReceiverOnline?: boolean;
  messageId: string;
}
