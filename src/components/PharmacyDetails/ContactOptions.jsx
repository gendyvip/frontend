import React from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import useChat from "../../store/useChat";
import { useAuth } from "../../store/useAuth";

export default function ContactOptions({ owner, pharmacyId }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const { startChat, setIsWidgetOpen, loadUserChats, selectChat, chats } =
    useChat();

  const handleChat = async () => {
    if (!currentUserId || !owner || !pharmacyId) {
      alert("Please login to start a chat");
      return;
    }

    try {
      // Start chat with the pharmacy owner
      await startChat(currentUserId, owner.id, pharmacyId, "pharmacy", {
        fullName: owner.fullName,
        profilePhotoUrl: owner.profilePhotoUrl,
        role: owner.role || "User",
      });

      // Refresh chat list
      await loadUserChats();

      // Find the new chat in the list (by pharmacyId or userId)
      const chatToSelect = chats.find(
        (c) => c.pharmacy?.id === pharmacyId || c.otherUser?.id === owner.id
      );
      if (chatToSelect) {
        await selectChat(chatToSelect);
      }

      // Open the chat widget immediately
      setIsWidgetOpen(true);
    } catch (error) {
      console.error("Error starting chat:", error);
      alert("Failed to start chat. Please try again.");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleChat}
        className="flex items-center gap-2 bg-gradient-to-r from-primary to-blue-500 text-white px-8 py-4 rounded-full shadow-xl font-semibold text-lg cursor-pointer hover:scale-105 transition-transform animate-pulse"
      >
        <MessageCircle className="w-7 h-7" />
        Chat with me
      </Button>
    </div>
  );
}
