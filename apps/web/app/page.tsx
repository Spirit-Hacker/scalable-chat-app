"use client";

import { useEffect, useRef, useState } from "react";
import { useSocket } from "./context/SocketProvider";
import Messages from "./components/Messages";
import { User } from "./types/user";
import { MessageWS } from "./types/messages";
import { showAllUsers } from "./services/userServices/auth.service";
import { IoIosSend } from "react-icons/io";
import Navbar from "./components/Navbar";
import ImageUploadModal from "./components/ImageUpload";

const showUsers: React.FC = () => {
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [receiverName, setReceiverName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [senderId, setSenderId] = useState<string>("");
  const [receiverId, setReceiverId] = useState<string>("");
  const [receiverProfilePicture, setReceiverProfilePicture] = useState<string>("");
  const [me, setMe] = useState<User | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const {
    sendMessage,
    messages,
    insertCurrentUserIdOnSocketServer,
    onlineUsers,
  } = useSocket();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setSenderId(userId);
    }

    if (userId) {
      const user = allUsers.find((user) => {
        if (user._id.toString() === userId.toString()) {
          return user;
        }
      });

      console.log("Me User: ", user);
      console.log("Me User Id: ", userId);
      setMe(user);
    }
  }, [allUsers]);

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
    <div className="w-full h-full">
      {
        isModalOpen && (
          <ImageUploadModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )
      }
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Navbar user={me} setIsModalOpen={setIsModalOpen} />
        <div className="w-[100%] h-[90%] bg-[#040019]">
          <div className="h-full flex items-center w-full rounded-md px-10 py-5 gap-3">
            <div className="min-h-full w-[25%] bg-[#110D24] text-white overflow-y-scroll [&::-webkit-scrollbar]:hidden rounded-3xl">
              {allUsers &&
                allUsers.map(
                  (user, index) =>
                    user._id !== senderId && (
                      <div
                        key={index}
                        className={`flex justify-between gap-4 items-center w-full px-6 py-3 cursor-pointer ${receiverId === user._id ? "bg-[#1B1338]" : "bg-[#110D24]"}`}
                        onClick={(e: React.MouseEvent) => {
                          setReceiverId(user._id);
                          setSenderId(localStorage.getItem("userId") as string);
                          setReceiverName(user.fullName);
                          setReceiverProfilePicture(user.profilePicture);
                        }}
                      >
                        <div className="flex gap-2 items-center">
                          <div className="w-[50px] h-[50px] rounded-full bg-purple-500">
                            <img
                              src={user.profilePicture}
                              alt="PF"
                              className="w-full h-full rounded-full overflow-hidden object-cover"
                            />
                          </div>
                          <p className="font-bold">{user.fullName}</p>
                        </div>
                        <div
                          className={`w-[10px] h-[10px] rounded-full ${onlineUsers.includes(user._id) ? "bg-green-300" : "bg-gray-500"}`}
                        ></div>
                      </div>
                    )
                )}
            </div>

            {receiverId && senderId ? (
              <div className="w-[75%] mb-1 h-full flex flex-col justify-between bg-[#110D24] rounded-3xl">
                {/* Chat Header */}
                <div className="h-[50px] w-[95%] flex items-center justify-start px-10 py-3 mx-auto mt-3 gap-5 rounded-3xl bg-[#1F173E] text-white">
                  <div className="w-[40px] h-[40px] rounded-full bg-purple-500">
                    <img
                      src={receiverProfilePicture}
                      alt="PF"
                      className="w-full h-full rounded-full overflow-hidden object-cover"
                    />
                  </div>
                  <div className="flex h-[40px] items-center justify-between w-[calc(100%-40px)]">
                    <div className="text-lg capitalize font-bold">
                      {receiverName}
                    </div>
                    <div className="flex gap-2 items-center justify-start">
                      <div
                        className={`w-[10px] h-[10px] rounded-full ${onlineUsers.includes(receiverId) ? "bg-green-300" : "bg-gray-500"}`}
                      />
                      <div>
                        {onlineUsers.includes(receiverId) ? "Online" : "Offline"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="h-[80%] min-h-[80%] mx-auto w-[95%] rounded-3xl overflow-hidden">
                  <Messages
                    messagesWS={messages as MessageWS[]}
                    receiverId={receiverId}
                    senderId={senderId}
                  />
                </div>

                {/* Send Message */}
                <div className="w-[95%] h-[50px] bg-[#1F173E] mx-auto flex items-center px-10 py-3 mb-3 justify-between rounded-3xl">
                  <form onSubmit={handleOnSubmit} className="h-full w-full">
                    <div className="flex justify-between h-full w-full items-center">
                      <input
                        ref={messageInputRef}
                        type="text"
                        className="w-[90%] bg-transparent border-gray-100 outline-none text-white"
                        placeholder="Enter message..."
                        onChange={handleOnChange}
                      />
                      <button
                        className="bg-purple-500 font-bold w-[40px] h-[40px] rounded-full flex items-center justify-center"
                        type="submit"
                      >
                        <IoIosSend color="black" fontSize={"25px"} />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="w-[75%] h-full flex items-center justify-center bg-[#110D24] rounded-3xl text-white">
                <h1 className="text-3xl">Select a user to start messaging</h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default showUsers;
