export interface User {
  fullName: string;
  username: string;
  email: string;
  _id: string;
  password?: string;
  messages?: string[];
  isOnline?: boolean;
  createdAt?: string;
  refreshToken?: string;
  accessToken?: string;
  updatedAt?: string;
  profilePicture: string;
}
