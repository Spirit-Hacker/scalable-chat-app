"use client";

import React, { useState } from "react";
import { useSocket } from "../../context/SocketProvider";
import { login } from "../../services/userServices/auth.service";
import { Toast } from "chaddi-ui";
import Link from "next/link";

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
        window.location.href = "/pages/showUsers";
        setLoginStatus("Success");
        insertCurrentUserIdOnSocketServer(response.data.user._id);
      }
    } catch (error) {
      console.log("error while login: ", error);
      setLoginStatus("Error");
    }
  };
  return (
    <div className="w-full h-full flex items-center justify-center">
      {loginStatus && (
        <div className="fixed top-10 right-44">
          <Toast
            message={
              loginStatus === "Success" ? "Login Success" : "Login Failed"
            }
            animation="slide"
            color={loginStatus === "Success" ? "green" : "red"}
            duration={3000}
            position="top-right"
          />
        </div>
      )}
      <div className="w-[500px] h-[500px] flex items-center justify-center">
        <div className="h-full w-full rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-90 border border-gray-100 p-10">
          <form
            onSubmit={handleSubmit}
            style={{ maxWidth: "400px", margin: "auto" }}
          >
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="username"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="password"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#007BFF",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
