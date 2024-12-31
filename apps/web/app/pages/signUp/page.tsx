"use client";

import React, { useState } from "react";
import { signUp } from "../../services/userServices/auth.service";
import { Toast } from "chaddi-ui";

interface FormData {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

const page: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const [registerStatus, setRegisterStatus] = useState<
    "" | "Success" | "Error"
  >("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log("form change", name, value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("form submit", formData);

    try {
      const response = await signUp(formData);

      if (response.success) {
        window.location.href = "/pages/login";
        setRegisterStatus("Success");
      }

      console.log("Response: ", response);
    } catch (error) {
      setRegisterStatus("Error");
      console.log("Error registering: ", error);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#040019]">
      {registerStatus && (
        <div className="fixed top-10 right-44">
          <Toast
            message={
              registerStatus === "Success"
                ? "Registeration Success"
                : "Registeration Failed"
            }
            animation="slide"
            color={registerStatus === "Success" ? "#DBFC7E" : "red"}
            duration={3000}
            position="top-right"
          />
        </div>
      )}
      <div className="flex items-center justify-center min-h-screen w-full bg-[#040019]">
        <div className="bg-[#110D24] p-8 rounded-3xl shadow-xl w-80 text-center">
          <h1 className="text-2xl font-bold text-[#DBFC7E]">SIGN UP</h1>
          <p className="text-sm text-gray-500 mb-6">TO CREATE YOUR ACCOUNT</p>
          <form onSubmit={handleSubmit}>
            <div className="flex items-center mb-4 bg-[#110D24] p-2 rounded-lg text-white">
              <span className="bg-[#110D24] text-lg mr-2">&#x1F464;</span>
              <input
                name="fullName"
                type="text"
                placeholder="Enter Your Name"
                className="bg-transparent focus:outline-none flex-1 bg-[#110D24] text-white"
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center mb-4 bg-[#110D24] p-2 rounded-lg">
              <span className="bg-[#110D24] text-lg mr-2">&#x1F464;</span>
              <input
                name="username"
                type="text"
                placeholder="Enter username"
                className="bg-transparent focus:outline-none flex-1 bg-[#110D24] text-white"
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center mb-4 bg-[#110D24] p-2 rounded-lg gap-2">
              <span className="text-gray-400 text-lg mr-1 ml-1">&#x2709;</span>
              <input
                name="email"
                type="email"
                placeholder="Enter email"
                className="bg-transparent focus:outline-none flex-1 text-white"
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center mb-6 bg-[#110D24] p-2 rounded-lg">
              <span className="text-gray-400 text-lg mr-2">&#x1F512;</span>
              <input
                name="password"
                type="password"
                placeholder="Enter password"
                className="bg-transparent focus:outline-none flex-1 text-white"
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#DBFC7E] text-black py-2 rounded-lg font-semibold"
            >
              SIGN UP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
