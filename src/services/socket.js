import { io } from "socket.io-client";

let socket = null;

export const getSocket = (userId = null) => {
  if (!socket) {
    // Get user ID from localStorage if not provided
    if (!userId) {
      try {
        const user = localStorage.getItem("user");
        if (user) {
          try {
            userId = JSON.parse(user);
          } catch {
            userId = user;
          }
        }
      } catch (error) {
        console.error("Error getting user ID from localStorage:", error);
      }
    }

    socket = io("http://localhost:3000", {
      transports: ["websocket"],
      autoConnect: true,
      query: {
        userId: userId || undefined,
      },
    });

    // Connection event handlers
    socket.on("connect", () => {
      console.log("Connected to chat server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from chat server");
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// These functions are not used by the backend
// The backend handles room joining through startChat event

// Updated: Accepts user1Id, user2Id, targetId, targetType
export const startChat = (user1Id, user2Id, targetId, targetType) => {
  const socket = getSocket();
  socket.emit("startChat", { user1Id, user2Id, targetId, targetType });
};

export const sendMessage = (roomId, senderId, text) => {
  const socket = getSocket();
  socket.emit("sendMessage", { roomId, senderId, text });
};

export const joinRoom = (roomId, userId) => {
  const socket = getSocket();
  socket.emit("joinRoom", { roomId, userId });
};

export const leaveRoom = (roomId, userId) => {
  const socket = getSocket();
  socket.emit("leaveRoom", { roomId, userId });
};

export const markRoomAsSeen = (roomId, userId) => {
  const socket = getSocket();
  socket.emit("markRoomAsSeen", { roomId, userId });
};
