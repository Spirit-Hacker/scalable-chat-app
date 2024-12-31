import axios from "axios";
import {
  GET_ALL_USERS_API,
  LOGIN_API,
  SIGN_UP_API,
  REFRESH_ACCESS_TOKEN,
} from "../apis";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});

api.interceptors.response.use(
  (response) => {
    console.log("Interceptor response", response);
    return response;
  },
  async (error) => {
    console.log("Interceptor error", error);
    if (error.response.status === 401) {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        console.log("refreshToken: ", refreshToken);
        if (!refreshToken) {
          window.location.href = "/pages/login";
          throw new Error("No refresh token found");
        }

        const response = await axios.post(
          REFRESH_ACCESS_TOKEN,
          {},
          {
            headers: {
              Authorization: refreshToken,
            },
          }
        );

        console.log("Response for Refresh Access Token: ", response);

        const { accessToken } = response.data.data;
        localStorage.setItem("accessToken", accessToken);

        error.config.headers.Authorization = accessToken;
        return api.request(error.config);
      } catch (error) {
        console.log("Error refreshing token: ", error);
        return Promise.reject(error);
      }
    }
  }
);

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
  try {
    const response = await api
      .get(GET_ALL_USERS_API, {
        headers: { Authorization: localStorage.getItem("accessToken") },
      })
      .then((res) => res.data)
      .catch((err) => {
        console.log("All Users Error: ", err);
        return err;
      });

    return response.data;
  } catch (error) {
    return null;
  }
};
