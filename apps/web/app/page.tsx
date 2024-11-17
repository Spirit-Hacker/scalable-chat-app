"use client";
import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import classes from "./page.module.css";
import {} from "./utils/first"

const page = () => {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  return (
    <div>
      <div>
        <h1>All messages appear here!!!</h1>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <div>
        <input
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          className={classes["chat-input"]}
          placeholder="message..."
        />
        <button
          onClick={() => {
            sendMessage(message);
            setMessage("");
          }}
          className={classes["button"]}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default page;
