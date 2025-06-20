import { Server as SocketIO } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

let io; 

const socketHandler = (server) => {
  io = new SocketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  return io; // Optionally return io
};

// Export a function to get the io instance
export const getIo = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized!");
  }
  return io;
};

export default socketHandler;
