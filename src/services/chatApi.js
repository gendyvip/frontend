const API_BASE_URL = "http://localhost:3000/api/v1";

export const getChatHistory = async (chatRoomId) => {
  try {
    const token = (() => {
      try {
        return JSON.parse(localStorage.getItem("token"));
      } catch {
        return localStorage.getItem("token");
      }
    })();
    const response = await fetch(
      `${API_BASE_URL}/chat/room/${chatRoomId}/messages`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const messages = await response.json();
    return messages.map((msg) => ({
      id: msg.id,
      content: msg.text,
      timestamp: new Date(msg.sentAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: msg.sender.fullName || msg.sender.id,
      senderId: msg.sender.id,
      isOwn: false, // Will be set by the component
      avatar: msg.sender.profilePhotoUrl,
      status: "read",
    }));
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};

export const getOrCreateChatRoom = async (
  user1Id,
  user2Id,
  targetId,
  targetType
) => {
  try {
    const token = (() => {
      try {
        return JSON.parse(localStorage.getItem("token"));
      } catch {
        return localStorage.getItem("token");
      }
    })();
    const response = await fetch(
      `${API_BASE_URL}/chat/room-id?user1=${user1Id}&user2=${user2Id}&targetId=${targetId}&targetType=${targetType}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.chatRoomId;
  } catch (error) {
    console.error("Error getting chat room:", error);
    throw error;
  }
};

export const getUserChats = async (userId) => {
  try {
    const token = (() => {
      try {
        return JSON.parse(localStorage.getItem("token"));
      } catch {
        return localStorage.getItem("token");
      }
    })();
    const response = await fetch(`${API_BASE_URL}/chat/user/${userId}/rooms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Handle the backend's paginated response structure
    if (result.success && result.data && result.data.chatRooms) {
      return result.data.chatRooms;
    }

    // Fallback to direct array if structure is different
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching user chats:", error);
    throw error;
  }
};
