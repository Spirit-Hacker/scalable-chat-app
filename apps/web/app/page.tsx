"use client";

import { useState, useEffect } from "react";
import { useSocket } from "./context/SocketProvider";
import classes from "./page.module.css";

const page = () => {
  const { sendMessage, messages, insertCurrentUserIdOnSocketServer } =
    useSocket();
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState("Receiver ki id");
  const [senderId, setSenderId] = useState("Sender ki id");

  useEffect(() => {
    insertCurrentUserIdOnSocketServer(senderId);
  }, []);

  return (
    <div>
      {/* <div>
        <h1>All messages appear here!!!</h1>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <div>
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setMessage(e.target.value);
          }}
          className={classes["chat-input"]}
          placeholder="message..."
        />
        <button
          onClick={() => {
            sendMessage(message, receiverId, senderId);
            setMessage("");
          }}
          className={classes["button"]}
        >
          Send
        </button>
      </div> */}
    </div>
  );
};

export default page;
