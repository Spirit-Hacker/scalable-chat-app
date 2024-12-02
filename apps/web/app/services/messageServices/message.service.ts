import axios from "axios";
import { GET_MESSAGES_API } from "../apis";

export const getMessagesInThisConversation = async (receiverId: string) => {
  const response = await axios.get(
    `${GET_MESSAGES_API}${receiverId}`,
    {
      headers: {
        Authorization: localStorage.getItem("accessToken"),
      },
    }
  );

  return response;
};
