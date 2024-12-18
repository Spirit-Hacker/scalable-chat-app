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
    <div className="w-full h-full flex items-center justify-center">
      {registerStatus && (
        <div className="fixed top-10 right-44">
          <Toast
            message={
              registerStatus === "Success"
                ? "Registeration Success"
                : "Registeration Failed"
            }
            animation="slide"
            color={registerStatus === "Success" ? "green" : "red"}
            duration={3000}
            position="top-right"
          />
        </div>
      )}
      <div className="w-[500px] h-[500px]">
        <div className="h-full w-full bg-white-900 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-90 border border-gray-100 p-10">
          <form
            onSubmit={handleSubmit}
            style={{ maxWidth: "400px", margin: "auto" }}
          >
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="fullName"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
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
                htmlFor="email"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
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
