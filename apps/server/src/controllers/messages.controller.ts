import { Request, Response } from "express";
import Message from "../models/message.model";
import Conversation from "../models/conversation.model";
import { Schema } from "mongoose";
import { IUser } from "../models/user.model";

export const storeMessage = async (req: Request, res: Response) => {
  try {
    const {
      senderId,
      message: messageText,
      isReceiverOnline,
      messageId,
    } = req.body;
    const { id: receiverId } = req.params;

    // console.log("Inside storeMessage", senderId, messageText, receiverId);

    const newMessage = new Message({
      content: messageText,
      sender: senderId,
      receiver: receiverId,
      isDelivered: isReceiverOnline,
      messageId: messageId,
    });

    if (!newMessage || !newMessage._id) {
      res.status(400).json({
        success: false,
        message: "Message not saved",
      });

      return;
    }

    await newMessage.save();

    let conversation = await Conversation.findOne({
      members: {
        $all: [senderId, receiverId],
      },
    });

    if (!conversation) {
      conversation = new Conversation({
        members: [senderId, receiverId],
      });
    }

    conversation.messages.push(newMessage._id as Schema.Types.ObjectId);
    await conversation.save();

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: {
        newMessage,
        conversation,
      },
    });

    return;
  } catch (error: Error | any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });

    return;
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { _id: userId } = req.user as IUser;
    const { id: friendId } = req.params;

    let conversation = await Conversation.findOne({
      members: {
        $all: [userId, friendId],
      },
    })
      .populate("messages")
      .exec();

    if (!conversation) {
      conversation = new Conversation({
        members: [userId, friendId],
      });
    }

    res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      data: {
        conversation,
      },
    });

    return;
  } catch (error: Error | any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });

    return;
  }
};
