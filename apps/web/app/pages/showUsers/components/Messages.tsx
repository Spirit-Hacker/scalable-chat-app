"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { MessageWS } from "../../../types/messages";
import { createMessageMap } from "../../../utils/createMessageMap";
import { Message } from "../../../types/messages";
import { getMessagesInThisConversation } from "../../../services/messageServices/message.service";

interface MessagesProps {
  messagesWS: MessageWS[];
  senderId: string;
  receiverId: string;
}

const Messages: React.FC<MessagesProps> = ({
  messagesWS,
  senderId,
  receiverId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  // to uniquely identify each message
  const [existingMessages, setExistingMessages] = useState<
    Record<string, Message>
  >({});

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const isRelevantMessage = (msg: MessageWS) => {
    return (
      ((msg.senderId === senderId && msg.receiverId === receiverId) ||
        (msg.senderId === receiverId && msg.receiverId === senderId)) &&
      !existingMessages[msg.messageId]
    );
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesWS]);

  const fetchMessages = async () => {
    const response = await getMessagesInThisConversation(receiverId);

    console.log(
      "Messages from DB: ",
      response.data.data.conversation?.messages
    );
    setMessages(response.data.data.conversation?.messages);
  };

  useEffect(() => {
    fetchMessages();
  }, [receiverId, senderId]);

  useEffect(() => {
    const messageMap = createMessageMap(messages);
    setExistingMessages(messageMap);
    console.log("Existing messages: ", existingMessages);
    scrollToBottom();
  }, [messages]);

  return (
    <div ref={chatContainerRef} className="flex-1 flex-grow overflow-y-auto p-4 rounded-md shadow-md h-[90%] w-full [&::-webkit-scrollbar]:hidden">
      {messages.length > 0 && (
        <div className={`flex flex-col gap-1 w-full`}>
          {messages.map((msg, index) => (
            <div
              className={`max-w-full p-1 rounded-lg flex flex-col ${
                msg.sender === senderId ? "items-end" : "items-start"
              }`}
              key={index}
            >
              <div
                className={`p-1 max-w-[50%] text-white rounded-md ${msg.sender === senderId ? "bg-blue-600" : "bg-gray-600"}`}
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
              isRelevantMessage(msg) && (
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
