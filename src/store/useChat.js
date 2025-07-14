import { create } from "zustand";
import {
  getSocket,
  startChat,
  sendMessage,
  joinRoom,
  leaveRoom,
  markRoomAsSeen,
} from "../services/socket";
import {
  getChatHistory,
  getOrCreateChatRoom,
  getUserChats,
} from "../services/chatApi";

const useChat = create((set, get) => ({
  // State
  chats: [],
  activeChat: null,
  messages: {},
  loading: false,
  error: null,
  socket: null,
  totalUnreadCount: 0, // Add this for reactive updates
  isWidgetOpen: false,
  setIsWidgetOpen: (open) => set({ isWidgetOpen: open }),

  // Helper function to get current user ID
  getCurrentUserId: () => {
    try {
      const user = localStorage.getItem("user");
      // Handle both string and JSON formats
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          // If it's an object with an id property, return the id
          if (typeof parsedUser === "object" && parsedUser.id) {
            return parsedUser.id;
          }
          // If it's just the ID string/number, return it
          return parsedUser;
        } catch {
          // If it's already a string (the ID), return it
          return user;
        }
      }
      return null;
    } catch {
      return null;
    }
  },

  initializeSocket: () => {
    const currentUserId = get().getCurrentUserId();
    if (!currentUserId) {
      console.error("Cannot initialize socket: No user ID found");
      return;
    }

    const socket = getSocket(currentUserId);
    set({ socket });

    // Remove previous listeners to prevent duplicates
    socket.off("newMessage");
    socket.off("chatRoom");
    socket.off("error");
    socket.off("unreadCountUpdated");
    socket.off("messageSeen");
    socket.off("roomMarkedAsSeen");
    socket.off("lastMessageUpdated");
    socket.off("newChatRoom"); // Remove previous newChatRoom listener

    // Listen for new messages
    socket.on("newMessage", (message) => {
      const { activeChat, chats } = get();

      // Update messages in active chat
      if (activeChat) {
        const currentUserId = get().getCurrentUserId();

        set((state) => {
          const msgs = state.messages[activeChat.roomId] || [];
          // If the last message is optimistic and matches, replace it
          if (
            msgs.length &&
            msgs[msgs.length - 1].temp &&
            msgs[msgs.length - 1].content === message.text &&
            msgs[msgs.length - 1].senderId === message.senderId
          ) {
            // Replace the optimistic message with the real one
            return {
              ...state,
              messages: {
                ...state.messages,
                [activeChat.roomId]: [
                  ...msgs.slice(0, -1),
                  {
                    id: Date.now().toString(),
                    content: message.text,
                    timestamp: new Date(message.sentAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                    sender: message.senderName || "Unknown",
                    senderId: message.senderId,
                    isOwn: message.senderId === currentUserId,
                    status: message.seenByReceiver ? "read" : "sent",
                  },
                ],
              },
            };
          }
          // Otherwise, just add the message
          return {
            ...state,
            messages: {
              ...state.messages,
              [activeChat.roomId]: [
                ...msgs,
                {
                  id: Date.now().toString(),
                  content: message.text,
                  timestamp: new Date(message.sentAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  sender: message.senderName || "Unknown",
                  senderId: message.senderId,
                  isOwn: message.senderId === currentUserId,
                  status: message.seenByReceiver ? "read" : "sent",
                },
              ],
            },
          };
        });
      }

      // Always update the chat list with the new message for the correct room
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.roomId === message.roomId
            ? {
                ...chat,
                lastMessage: {
                  text: message.text,
                  sentAt: message.sentAt,
                },
                updatedAt: new Date().toISOString(),
              }
            : chat
        ),
      }));
    });

    // Listen for chat room creation/joining
    socket.on("chatRoom", async ({ roomId }) => {
      const { activeChat } = get();
      if (activeChat) {
        try {
          const messages = await getChatHistory(roomId);
          const currentUserId = get().getCurrentUserId();

          // Mark messages as own if sent by current user
          const processedMessages = messages.map((msg) => ({
            ...msg,
            isOwn: msg.senderId === currentUserId,
          }));

          set((state) => ({
            messages: {
              ...state.messages,
              [roomId]: processedMessages,
            },
            activeChat: {
              ...state.activeChat,
              roomId,
            },
          }));
        } catch (error) {
          console.error("Error loading chat history:", error);
        }
      }
    });

    // Listen for unread count updates
    socket.on("unreadCountUpdated", ({ roomId, unreadCount }) => {
      set((state) => {
        const updatedChats = state.chats.map((chat) =>
          chat.roomId === roomId ? { ...chat, unreadCount } : chat
        );

        // Calculate new total unread count (number of rooms with unread messages)
        const newTotalUnread = updatedChats.filter(
          (chat) => (chat.unreadCount || 0) > 0
        ).length;

        return {
          chats: updatedChats,
          totalUnreadCount: newTotalUnread,
        };
      });
    });

    // Listen for message seen status
    socket.on("messageSeen", ({ messageId, seenBy }) => {
      const { activeChat } = get();
      if (activeChat) {
        set((state) => ({
          messages: {
            ...state.messages,
            [activeChat.roomId]:
              state.messages[activeChat.roomId]?.map((msg) =>
                msg.id === messageId ? { ...msg, status: "read" } : msg
              ) || [],
          },
        }));
      }
    });

    // Listen for room marked as seen
    socket.on("roomMarkedAsSeen", ({ roomId, userId }) => {
      set((state) => {
        const updatedChats = state.chats.map((chat) =>
          chat.roomId === roomId ? { ...chat, unreadCount: 0 } : chat
        );

        // Calculate new total unread count (number of rooms with unread messages)
        const newTotalUnread = updatedChats.filter(
          (chat) => (chat.unreadCount || 0) > 0
        ).length;

        return {
          chats: updatedChats,
          totalUnreadCount: newTotalUnread,
        };
      });
    });

    // Listen for last message updates
    socket.on("lastMessageUpdated", ({ roomId, text, sentAt }) => {
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.roomId === roomId
            ? {
                ...chat,
                lastMessage: { text, sentAt },
                updatedAt: new Date().toISOString(),
              }
            : chat
        ),
      }));
    });

    // Listen for errors
    socket.on("error", (error) => {
      console.error("Socket error:", error);
      set({ error: error.message });
    });

    // Listen for new chat room creation (for receiver)
    socket.on("newChatRoom", () => {
      get().loadUserChats();
    });
  },

  startChat: async (user1Id, user2Id, targetId, targetType, otherUserInfo) => {
    set({ loading: true, error: null });

    try {
      // Create or get chat room
      const roomId = await getOrCreateChatRoom(
        user1Id,
        user2Id,
        targetId,
        targetType
      );

      // Initialize socket if not already done
      if (!get().socket) {
        get().initializeSocket();
      }

      // Start chat via WebSocket
      startChat(user1Id, user2Id, targetId, targetType);

      // Set active chat
      const activeChat = {
        roomId,
        user1Id,
        user2Id,
        targetId,
        targetType,
        otherUser: otherUserInfo,
      };

      set({ activeChat, loading: false });

      return roomId;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  sendMessage: async (text) => {
    const { activeChat, socket } = get();
    if (!activeChat || !text.trim()) return;

    const currentUserId = get().getCurrentUserId();
    const tempId = Date.now().toString();
    const newMessage = {
      id: tempId,
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "You",
      senderId: currentUserId,
      isOwn: true,
      status: "sent",
      temp: true, // mark as optimistic
    };

    // Optimistically add message to UI
    set((state) => ({
      messages: {
        ...state.messages,
        [activeChat.roomId]: [
          ...(state.messages[activeChat.roomId] || []),
          newMessage,
        ],
      },
    }));

    // Send via WebSocket
    sendMessage(activeChat.roomId, currentUserId, text.trim());
  },

  loadUserChats: async () => {
    set({ loading: true, error: null });

    try {
      const currentUserId = get().getCurrentUserId();

      if (!currentUserId) {
        throw new Error("User not authenticated");
      }

      const chatRooms = await getUserChats(currentUserId);

      // Transform the chat rooms data for the UI
      const transformedChats = chatRooms.map((room) => {
        // Determine the other user (not the current user)
        const otherUser =
          room.sender.id === currentUserId ? room.reciver : room.sender;

        return {
          roomId: room.id,
          user1Id: room.sender.id,
          user2Id: room.reciver.id,
          dealId: room.deal?.id,
          deal: room.deal,
          pharmacyId: room.pharmacy?.id,
          pharmacy: room.pharmacy,
          otherUser: {
            id: otherUser.id,
            fullName: otherUser.fullName || otherUser.name || "Unknown User",
            profilePhotoUrl: otherUser.profilePhotoUrl || otherUser.avatar,
            role: otherUser.role || "User",
          },
          lastMessage: room.lastMessage || null,
          unreadCount: room.unreadCount || 0,
          updatedAt: room.updatedAt || room.createdAt,
        };
      });

      // Calculate total unread count (number of rooms with unread messages)
      const totalUnread = transformedChats.filter(
        (chat) => (chat.unreadCount || 0) > 0
      ).length;

      set({
        chats: transformedChats,
        totalUnreadCount: totalUnread,
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error("Error loading user chats:", error);
    }
  },

  selectChat: async (chat) => {
    set({ loading: true, error: null });

    try {
      // Initialize socket if not already done
      if (!get().socket) {
        get().initializeSocket();
      }

      const currentUserId = get().getCurrentUserId();

      // Join the chat room via WebSocket
      joinRoom(chat.roomId, currentUserId);

      // Mark room as seen when selecting it
      markRoomAsSeen(chat.roomId, currentUserId);

      // Load chat history
      const messages = await getChatHistory(chat.roomId);

      // Mark messages as own if sent by current user
      const processedMessages = messages.map((msg) => ({
        ...msg,
        isOwn: msg.senderId === currentUserId,
      }));

      set((state) => ({
        activeChat: chat,
        messages: {
          ...state.messages,
          [chat.roomId]: processedMessages,
        },
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error("Error selecting chat:", error);
    }
  },

  setActiveChat: (chat) => {
    set({ activeChat: chat });
  },

  clearError: () => {
    set({ error: null });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({ socket: null, activeChat: null, messages: {} });
  },

  getTotalUnread: () => {
    const { chats } = get();
    return chats.filter((chat) => (chat.unreadCount || 0) > 0).length;
  },
}));

export default useChat;
