import { Message } from "../types/messages";

export const createMessageMap = (messages: Message[]): Record<string, Message> => {
  const messageMap = messages.reduce(
    (acc, cur) => {
      acc[cur.messageId] = cur;
      return acc;
    },
    {} as Record<string, Message>
  );
  return messageMap;
};
