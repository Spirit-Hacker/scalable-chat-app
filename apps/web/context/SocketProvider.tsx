"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string, receiverId: string, senderId: string) => any;
  messages: string[];
  insertCurrentUserIdOnSocketServer: (userId: string) => any;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error("state is undefined");

  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg, receiverId, senderId) => {
      console.log("Send Message", msg);
      if (socket) {
        socket.emit("event:message", {
          message: msg,
          receiverId: receiverId,
          senderId: senderId,
        });
      }
    },
    [socket]
  );

  const insertCurrentUserIdOnSocketServer = useCallback((userId: string) => {
    console.log("User to save on socket server: ", userId);
    if (socket) {
      console.log("Socket: ", socket);
      socket.emit("login", userId);
    }
  }, [socket]);

  const onMessageReceived = useCallback((message: string) => {
    console.log("Message Received from Server: ", message);
    setMessages((prev) => [...prev, message]);
  }, []);

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    console.log("Socket connected");
    setSocket(_socket);

    _socket.on("message", onMessageReceived);

    return () => {
      _socket.off("message", onMessageReceived);
      _socket.disconnect();
      setSocket(undefined);
      console.log("Socket disconnected");
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMessage, messages, insertCurrentUserIdOnSocketServer }}>
      {children}
    </SocketContext.Provider>
  );
};
