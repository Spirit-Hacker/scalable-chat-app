import axios from "axios";
import { GET_ALL_USERS_API, LOGIN_API, SIGN_UP_API } from "../apis";

export const signUp = async (formData: any) => {
  const response = await axios
    .post(SIGN_UP_API, formData, {
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));

  return response;
};

export const login = async (formData: any) => {
  const response = await axios
    .post(LOGIN_API, formData, {
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch((err) => err);

  console.log("Response: ", response);

  localStorage.setItem("accessToken", response.data.accessToken);
  localStorage.setItem("refreshToken", response.data.refreshToken);
  localStorage.setItem("userId", response.data.user._id);

  return response;
};

export const showAllUsers = async () => {
  const response = await axios
    .get(GET_ALL_USERS_API, {
      headers: { Authorization: localStorage.getItem("accessToken") },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));

  console.log("all Users", response);

  return response;
};
