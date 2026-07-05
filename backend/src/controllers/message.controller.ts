import {Request, Response} from "express";
import mongoose from "mongoose";
import User from "../models/user.model.ts";
import Message from "../models/message.model.ts";
import {hasImageKitConfig, uploadChatMedia} from "../lib/imagekit.ts";
import {getReceiverSocketId, io} from "../lib/socket.ts";

export const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user?.id;
    const filteredUsers = await User.find({
      _id: {$ne: loggedInUserId},
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error);
    res.status(500).json({message: "Internal server error"});
  }
};

export async function getConversationsForSidebar(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const loggedInUserId = req.user?.id;

    if (!loggedInUserId) {
      res.status(401).json({message: "Unauthorized"});
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(loggedInUserId);

    const conversations = await Message.aggregate([
      // 1. Keep only the messages I sent or received.
      {
        $match: {
          $or: [{senderId: userObjectId}, {receiverId: userObjectId}],
        },
      },
      // 2. Collapse them into one row per chat partner, noting our latest message time.
      {
        $group: {
          _id: {
            $cond: [
              {$eq: ["$senderId", userObjectId]},
              "$receiverId",
              "$senderId",
            ],
          },
          lastMessageAt: {$max: "$createdAt"},
        },
      },
      // 3. Put the most recent conversation at the top.
      {$sort: {lastMessageAt: -1}},
      // 4. Look up each partner's user profile (comes back as an array).
      {
        $lookup: {
          from: "user", // Matches the collection name 'user' in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      // 5. Pull that profile out of the array and make it the document.
      {$replaceRoot: {newRoot: {$first: "$user"}}},
      // 6. Hide the private password field from the result.
      {$project: {password: 0}},
    ]);

    res.status(200).json(conversations);
  } catch (error: any) {
    console.error("Error in getConversationsForSidebar:", error.message);
    res.status(500).json({message: "Internal server error"});
  }
}

export const getMessages = async (req: Request, res: Response) => {
  try {
    const {id: userToChatId} = req.params;
    const loggedInUserId = req.user?.id;

    const loggedInUserObjectId = new mongoose.Types.ObjectId(loggedInUserId);
    const userToChatObjectId = new mongoose.Types.ObjectId(
      userToChatId as string,
    );

    const messages = await Message.find({
      $or: [
        {senderId: loggedInUserObjectId, receiverId: userToChatObjectId},
        {senderId: userToChatObjectId, receiverId: loggedInUserObjectId},
      ],
    }).sort({createdAt: 1});

    res.status(200).json(messages);
  } catch (error: any) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({message: "Internal server error"});
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const {message} = req.body;
    const {id: receiverId} = req.params;
    const senderId = req.user?.id;

    let imageUrl, videoUrl;

    if (req.file) {
      if (!hasImageKitConfig()) {
        return res
          .status(500)
          .json({message: "Media upload is not configured"});
      }

      const url = await uploadChatMedia(req.file);
      if (req.file.mimetype.startsWith("video/")) videoUrl = url;
      else imageUrl = url;
    }

    const receiverObjectId = new mongoose.Types.ObjectId(receiverId as string);
    const senderObjectId = new mongoose.Types.ObjectId(senderId as string);

    const receiver = await User.findById(receiverObjectId);
    if (!receiver) {
      return res.status(404).json({message: "Receiver not found"});
    }

    const newMessage = await Message.create({
      senderId: senderObjectId,
      receiverId: receiverObjectId,
      message,
      image: imageUrl,
      video: videoUrl,
    });

    // REALTIME Message WITH SOCKETIO

    const receiverSocketId = getReceiverSocketId(receiverId as string);

    //Only send the message realtime if receiver is online
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error: any) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({message: "Internal server error"});
  }
};
