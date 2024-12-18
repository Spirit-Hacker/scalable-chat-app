"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketProvider";
import Messages from "./components/Messages";
import { User } from "../../types/user";
import { MessageWS } from "../../types/messages";
import { showAllUsers } from "../../services/userServices/auth.service";

const showUsers: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [receiverName, setReceiverName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [senderId, setSenderId] = useState<string>("");
  const [receiverId, setReceiverId] = useState("");
  const { sendMessage, messages, insertCurrentUserIdOnSocketServer } =
    useSocket();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setSenderId(storedUserId);
    }
  }, []);

  const fetchUsers = async () => {
    const res = await showAllUsers();

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

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(message, receiverId, senderId);
    setMessage("");
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="w-[95%] h-[95%]">
      <div className="h-full flex items-center gap-5 w-full bg-white-900 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-90 borderp-10">
        <div className="h-full w-[25%] overflow-y-scroll [&::-webkit-scrollbar]:hidden">
          {allUsers.map((user, index) => (
            <div
              key={index}
              className="flex justify-start items-center w-full p-3 cursor-pointer rounded-md mb-2"
              onClick={(e: React.MouseEvent) => {
                setReceiverId(user._id);
                setSenderId(localStorage.getItem("userId") as string);
                setReceiverName(user.fullName);
              }}
            >
              {user.fullName}
            </div>
          ))}
        </div>

        {receiverId && senderId ? (
          <div className="w-[75%] h-full flex flex-col justify-start">
            <div className="h-[10%] w-full flex items-center justify-center">
              <div className="text-2xl capitalize">{receiverName}</div>
            </div>

            <div className="h-[80%] w-full">
              <Messages
                messagesWS={messages as MessageWS[]}
                receiverId={receiverId}
                senderId={senderId}
              />
            </div>

            <form onSubmit={handleOnSubmit} className="h-[7%]">
              <div className="flex justify-between h-full gap-5">
                <input
                  type="text"
                  className="w-[90%] p-2 bg-transparent border border-gray-100 rounded-md"
                  placeholder="Enter message..."
                  onChange={handleOnChange}
                />
                <button
                  className="bg-blue-500 text-white w-[10%] text-xl font-bold rounded-md hover:bg-blue-600"
                  type="submit"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="w-[95%] h-[95%] flex items-center justify-center">
            <h1 className="text-3xl">Select a user to start messaging</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default showUsers;
