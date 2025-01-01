
// User API
export const SIGN_UP_API = `${process.env.NEXT_PUBLIC_SERVER_URL}/users/register`;
export const LOGIN_API = `${process.env.NEXT_PUBLIC_SERVER_URL}/users/login`;
export const GET_ALL_USERS_API = `${process.env.NEXT_PUBLIC_SERVER_URL}/users/getAllUsers`;
export const REFRESH_ACCESS_TOKEN = `${process.env.NEXT_PUBLIC_SERVER_URL}/users/refreshAccessToken`;
export const LOGOUT_API = `${process.env.NEXT_PUBLIC_SERVER_URL}/users/logout`;


// Messages API
export const GET_MESSAGES_API = `${process.env.NEXT_PUBLIC_SERVER_URL}/messages/getAllMessages/`;