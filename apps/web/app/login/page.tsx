"use client";

import axios from "axios";
import React, { useState } from "react";
import { useSocket } from "../../context/SocketProvider";

interface FormData {
  username: string;
  password: string;
}

const page: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

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

    const response = await axios
      .post(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/login`, formData, {
        withCredentials: true,
      })
      .then((res) => res.data)
      .catch((err) => console.log(err));

    console.log("Response: ", response);

    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    localStorage.setItem("userId", response.data.user._id);

    insertCurrentUserIdOnSocketServer(response.data.user._id);
  };
  return (
    <div className="w-[500px] h-[500px]">
      <div className="h-full w-full bg-white-900 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-90 border border-gray-100 p-10">
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
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
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
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
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
  );
};

export default page;
