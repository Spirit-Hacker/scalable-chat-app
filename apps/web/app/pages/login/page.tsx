"use client";

import React, { useState } from "react";
import { useSocket } from "../../context/SocketProvider";
import { login } from "../../services/userServices/auth.service";
import { Toast } from "chaddi-ui";

interface FormData {
  username: string;
  password: string;
}

const page: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  const [loginStatus, setLoginStatus] = useState<"" | "Success" | "Error">("");

  const { insertCurrentUserIdOnSocketServer } = useSocket();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // console.log("form change", name, value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("form submit", formData);

    try {
      const response = await login(formData);

      if (response.success) {
        window.location.href = "/";
        setLoginStatus("Success");
        insertCurrentUserIdOnSocketServer(response.data.user._id);
      }
    } catch (error) {
      console.log("error while login: ", error);
      setLoginStatus("Error");
    }
  };
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#040019]">
      {loginStatus && (
        <div className="fixed top-10 right-44">
          <Toast
            message={
              loginStatus === "Success" ? "Login Success" : "Login Failed"
            }
            animation="slide"
            color={loginStatus === "Success" ? "#DBFC7E" : "red"}
            duration={3000}
            position="top-right"
          />
        </div>
      )}
      <div className="flex items-center justify-center min-h-screen w-full bg-[#040019]">
        <div className="bg-[#110D24] p-8 rounded-3xl shadow-xl w-80 text-center">
          <h1 className="text-2xl font-bold text-[#DBFC7E]">LOGIN</h1>
          <p className="text-sm text-gray-500 mb-6">TO CONTINUE</p>
          <form onSubmit={handleSubmit}>
            <div className="flex items-center mb-4 bg-[#110D24] p-2 rounded-lg">
              <span className="text-lg mr-2">&#x1F464;</span>
              <input
                name="username"
                type="username"
                placeholder="Enter username"
                className="bg-transparent text-white focus:outline-none flex-1"
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center mb-6 bg-[#110D24] p-2 rounded-lg">
              <span className="text-lg mr-2">&#x1F512;</span>
              <input
                name="password"
                type="password"
                placeholder="Enter password"
                className="bg-transparent text-white focus:outline-none flex-1"
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#DBFC7E] text-black py-2 rounded-lg font-semibold"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
