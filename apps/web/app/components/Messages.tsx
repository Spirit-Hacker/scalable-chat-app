"use client";

import axios from "axios";
import { useEffect, useState } from "react";

interface MessageWS {
  message: string;
  senderId: string;
  receiverId: string;
  isReceiverOnline?: boolean;
}

interface MessagesProps {
  messagesWS: MessageWS[];
  senderId: string;
  receiverId: string;
}

interface Message {
  _id: string;
  content: string;
  isDelivered: boolean;
  sender: string;
  receiver: string;
  createdAt?: string;
  updatedAt?: string;
}

const Messages: React.FC<MessagesProps> = ({
  messagesWS,
  senderId,
  receiverId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const fetchMessages = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/messages/getAllMessages/${receiverId}`,
      {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      }
    );

    console.log("Messages: ", response.data.data.conversation?.messages);
    setMessages(response.data.data.conversation?.messages);
  };

  useEffect(() => {
    fetchMessages();
  }, [receiverId, senderId]);

  return (
    <div className="flex-1 overflow-y-auto p-4 rounded-md shadow-md h-[90%] w-full">
      {messages.length > 0 && (
        <div className={`flex flex-col gap-1 w-full`}>
          {messages.map((msg, index) => (
            <div
              className={`max-w-[full] p-1 rounded-lg flex flex-col ${
                msg.sender === senderId ? "items-end" : "items-start"
              }`}
              key={index}
            >
              <div
                className={`p-1 text-white rounded-md ${msg.sender === senderId ? "bg-blue-600" : "bg-gray-600"}`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {messagesWS.length > 0 && (
        <div className={`flex flex-col gap-1 w-full`}>
          {messagesWS.map(
            (msg, index) =>
              ((msg.senderId === senderId && msg.receiverId === receiverId) ||
                (msg.senderId === receiverId &&
                  msg.receiverId === senderId)) && (
                <div
                  className={`max-w-[full] p-1 rounded-lg flex flex-col ${
                    msg.senderId === senderId ? "items-end" : "items-start"
                  }`}
                  key={index}
                >
                  <div
                    className={`p-1 text-white rounded-md ${msg.senderId === senderId ? "bg-blue-600" : "bg-gray-600"}`}
                  >
                    {msg.message}
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default Messages;
