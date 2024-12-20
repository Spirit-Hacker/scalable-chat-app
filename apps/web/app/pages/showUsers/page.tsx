"use client";

import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/SocketProvider";
import Messages from "./components/Messages";
import { User } from "../../types/user";
import { MessageWS } from "../../types/messages";
import { showAllUsers } from "../../services/userServices/auth.service";

const showUsers: React.FC = () => {
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [receiverName, setReceiverName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [senderId, setSenderId] = useState<string>("");
  const [receiverId, setReceiverId] = useState("");
  const { sendMessage, messages, insertCurrentUserIdOnSocketServer, onlineUsers } =
    useSocket();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setSenderId(storedUserId);
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await showAllUsers();
  
      console.log("all Users", res);
      setAllUsers(res);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
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
    if (messageInputRef.current) {
      messageInputRef.current.value = "";
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="w-[100%] h-[100%]">
      <div className="h-full flex items-center w-full bg-white-900 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-90 borderp-10">
        <div className="h-full w-[25%] overflow-y-scroll bg-purple-200 [&::-webkit-scrollbar]:hidden border border-r-purple-700">
          {allUsers && allUsers.map((user, index) => (
            <div
              key={index}
              className={`flex justify-between gap-4 items-center w-full p-3 cursor-pointer ${receiverId === user._id ? "bg-purple-400" : "bg-purple-200"}`}
              onClick={(e: React.MouseEvent) => {
                setReceiverId(user._id);
                setSenderId(localStorage.getItem("userId") as string);
                setReceiverName(user.fullName);
              }}
            >
              <div className="flex gap-2 items-center">
                <div className="w-[50px] h-[50px] rounded-full bg-purple-500"></div>
                <p className="font-bold">{user.fullName}</p>
              </div>
              <div className={`w-[10px] h-[10px] rounded-full ${onlineUsers.includes(user._id) ? "bg-green-300" : "bg-gray-500"}`}></div>
            </div>
          ))}
        </div>

        {receiverId && senderId ? (
          <div className="w-[75%] h-full flex flex-col ">
            <div className="h-[15%] w-full flex items-center justify-start pl-4 pr-4 gap-5 border border-b-purple-800 bg-purple-200">
              <div className="w-[60px] h-[60px] rounded-full bg-purple-500"></div>
              <div>
                <div className="text-2xl capitalize font-bold">
                  {receiverName}
                </div>
                <div className="flex gap-2 items-center justify-start">
                  <div className={`w-[10px] h-[10px] rounded-full ${onlineUsers.includes(receiverId) ? "bg-green-300" : "bg-gray-500"}`} />
                  <div>{onlineUsers.includes(receiverId) ? "Online" : "Offline"}</div>
                </div>
              </div>
            </div>

            <div className="h-[80%] min-h-[80%] w-full">
              <Messages
                messagesWS={messages as MessageWS[]}
                receiverId={receiverId}
                senderId={senderId}
              />
            </div>

            <div className="w-full h-[15%] flex flex-col justify-center border-t-2 border-gray-200 pl-4 pr-4">
              <form onSubmit={handleOnSubmit} className="h-[70%]">
                <div className="flex justify-between h-full gap-5">
                  <input
                    ref={messageInputRef}
                    type="text"
                    className="w-[90%] p-2 bg-transparent border-gray-100 outline-none"
                    placeholder="Enter message..."
                    onChange={handleOnChange}
                  />
                  <button
                    className="bg-purple-500 text-white w-[10%] text-xl font-bold rounded-md hover:bg-purple-600"
                    type="submit"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="w-[75%] h-full flex items-center justify-center">
            <h1 className="text-3xl">Select a user to start messaging</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default showUsers;
