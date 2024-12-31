"use client";

import { useEffect, useRef, useState } from "react";
import { MessageWS } from "../types/messages";
import { createMessageMap } from "../utils/createMessageMap";
import { Message } from "../types/messages";
import { getMessagesInThisConversation } from "../services/messageServices/message.service";

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
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
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
    <div
      ref={chatContainerRef}
      className="overflow-y-auto h-full max-w-full [&::-webkit-scrollbar]:hidden"
    >
      {messages.length > 0 && (
        <div className={`flex flex-col gap-1 w-full`}>
          {messages.map((msg, index) => (
            <div
              className={`w-full p-1 rounded-lg flex flex-col ${
                msg.sender === senderId ? "items-end" : "items-start"
              }`}
              key={index}
            >
              <div
                className={`p-1 break-words max-w-[50%] rounded-xl pl-5 pr-5  ${msg.sender === senderId ? "bg-purple-500 text-white" : "bg-[#1F173E] text-white"}`}
                style={{
                  wordBreak: "break-word", // Ensures words break if too long
                  overflowWrap: "break-word", // Ensures long strings break
                  whiteSpace: "wrap",
                }}
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
                    className={`p-1 break-words max-w-[50%] rounded-xl pl-5 pr-5 ${msg.senderId === senderId ? "bg-purple-500 text-white" : "bg-[#1F173E] text-white"}`}
                    style={{
                      wordBreak: "break-word", // Ensures words break if too long
                      overflowWrap: "break-word", // Ensures long strings break
                      whiteSpace: "wrap",
                    }}
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
