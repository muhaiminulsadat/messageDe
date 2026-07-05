import express from "express";
import http from "http";
import {Server} from "socket.io";

const app = express();
const server = http.createServer(app);

// Allow frontend to connect
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

const io = new Server(server, {cors: {origin: [allowedOrigin]}});

// Online users map = { userId: socketId }
const userSocketMap: Record<string, string> = {};

// Utility function to get receiver's socket id
function getReceiverSocketId(userId: string): string | undefined {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string | undefined;

  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() sends event to everyone - broadcast
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // socket.on is used to listen for events
  socket.on("disconnect", () => {
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export {app, server, io, getReceiverSocketId};
