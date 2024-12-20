"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { MessageWS } from "../types/messages";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string, receiverId: string, senderId: string) => any;
  messages: MessageWS[];
  insertCurrentUserIdOnSocketServer: (userId: string) => any;
  onlineUsers: string[];
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error("state is undefined");

  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<MessageWS[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg, receiverId, senderId) => {
      console.log("Send Message", msg);
      if (msg.trim() === "") return;
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

  const insertCurrentUserIdOnSocketServer = useCallback(
    (userId: string) => {
      console.log("User to save on socket server: ", userId);
      if (socket) {
        console.log("Socket: ", socket);
        socket.emit("login", userId);
      }
    },
    [socket]
  );

  const onMessageReceived = useCallback((message: MessageWS) => {
    console.log("Message Received from Server: ", message);
    setMessages((prev) => [...prev, message]);
  }, []);

  const getOnlineUsers = useCallback((allOnlineUsers: string[]) => {
    console.log("Online Users: ", allOnlineUsers);
    setOnlineUsers(allOnlineUsers);
  }, []);

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    console.log("Socket connected");
    setSocket(_socket);

    _socket.on("message", onMessageReceived);
    _socket.on("users:online", getOnlineUsers);

    return () => {
      _socket.off("message", onMessageReceived);
      _socket.disconnect();
      setSocket(undefined);
      console.log("Socket disconnected");
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ sendMessage, messages, insertCurrentUserIdOnSocketServer, onlineUsers }}
    >
      {children}
    </SocketContext.Provider>
  );
};
