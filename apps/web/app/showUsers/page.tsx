"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { MessageWS, useSocket } from "../../context/SocketProvider";
import Messages from "../components/Messages";

interface User {
  fullName: string;
  username: string;
  email: string;
  _id: string;
  password?: string;
  messages?: string[];
  isOnline?: boolean;
  createdAt?: string;
  refreshToken?: string;
  accessToken?: string;
  updatedAt?: string;
}

const showUsers: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [message, setMessage] = useState<string>("");
  const [senderId, setSenderId] = useState(
    localStorage.getItem("userId") as string
  );
  const [receiverId, setReceiverId] = useState("");
  const { sendMessage, messages, insertCurrentUserIdOnSocketServer } =
    useSocket();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setSenderId(storedUserId);
    }
  }, []);

  const fetchUsers = async () => {
    const res = await axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/getAllUsers`, {
        headers: { Authorization: localStorage.getItem("accessToken") },
      })
      .then((res) => res.data)
      .catch((err) => console.log(err));

    console.log("all Users", res);
    setAllUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (senderId) {
      console.log("Calling insertCurrentUserIdOnSocketServer with:", senderId);
      insertCurrentUserIdOnSocketServer(senderId);
    }
  }, [senderId, insertCurrentUserIdOnSocketServer]);

  useEffect(() => {
    console.log("Messages: ", messages);
  }, [messages]);

  return (
    <div className="w-[900px] h-[500px]">
      <div className="h-full flex items-center gap-5 w-full bg-white-900 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-90 border border-gray-100 p-10">
        <div className="h-full w-[25%] overflow-y-scroll">
          {allUsers.map((user, index) => (
            <div
              key={index}
              className="flex justify-start items-center w-full p-3 bg-black cursor-pointer rounded-md mb-2"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                setReceiverId(user._id);
                setSenderId(localStorage.getItem("userId") as string);
              }}
            >
              {user.fullName}
            </div>
          ))}
        </div>

        {receiverId && senderId && (
          <div className="w-[75%] h-full flex flex-col justify-end">
            <div className="h-[90%] w-full">
              <Messages
                messagesWS={messages as MessageWS[]}
                receiverId={receiverId}
                senderId={senderId}
              />
            </div>

            <div className="flex justify-between h-[10%] gap-5">
              <input
                type="text"
                className="w-[80%] p-2 bg-transparent border border-gray-100 rounded-md"
                placeholder="Enter message..."
                onChange={handleOnChange}
              />
              <button
                className="bg-blue-500 text-white w-[20%] text-xl font-bold rounded-md hover:bg-blue-600"
                onClick={(e: React.MouseEvent) => {
                  // e.preventDefault();
                  sendMessage(message as string, receiverId, senderId);
                  setMessage("");
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default showUsers;
