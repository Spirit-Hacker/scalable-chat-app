import { Request, Response } from "express";
import Message from "../models/message.model";
import Conversation from "../models/conversation.model";
import { Schema } from "mongoose";

export const storeMessage = async (req: Request, res: Response) => {
  try {
    const { senderId, message: messageText } = req.body;
    const { id: receiverId } = req.params;

    console.log("Inside storeMessage", senderId, messageText, receiverId);

    const newMessage = new Message({
      content: messageText,
      sender: senderId,
      receiver: receiverId,
    });

    await newMessage.save();

    if (!newMessage || !newMessage._id) {
      res.status(400).json({
        success: false,
        message: "Message not saved",
      });

      return;
    }

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
    const senderId = (req as any).user._id;
    const { id: receiverId } = req.params;

    const conversation = await Conversation.findOne({
      members: {
        $all: [senderId, receiverId],
      },
    })
      .populate("messages")
      .exec();

    if (!conversation || conversation.messages.length === 0) {
      res.status(400).json({
        success: false,
        message: "Conversation not found",
      });

      return;
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
