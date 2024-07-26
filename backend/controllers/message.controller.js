import Conversation from "../models/conversations.model.js";
import Message from "../models/messages.model.js";
import { getReceiverIdSocket, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    Promise.all([await conversation.save()], [await newMessage.save()]);

    const receiverIdSocket = getReceiverIdSocket(receiverId);
    if (receiverIdSocket) {
      io.to(receiverIdSocket).emit("newMessage", newMessage);
    }

    res.status(201).json({
      status: "success",
      data: newMessage,
    });
  } catch (error) {
    console.log("Error in message controller", error.message, error.stack);
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]);
    }

    const messages = conversation.messages;
    res.status(200).json({
      status: "success",
      data: messages,
    });
  } catch (error) {
    console.log("Error in message controller", error.message, error.stack);
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};
