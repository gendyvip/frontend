import React from "react";
import { User2, CheckCircle2, MessageCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import useChat from "../../store/useChat";
import { useAuth } from "../../store/useAuth";

export default function AdvertiserInfo({ owner, pharmacyId }) {
  // Get initials for fallback
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };
  const initials = getInitials(owner?.fullName);

  // Chat logic (from ContactOptions)
  const { startChat, setIsWidgetOpen, loadUserChats, selectChat, chats } =
    useChat();
  const { user } = useAuth();
  const currentUserId = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

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
      await loadUserChats();
      // Find the new chat in the list (by pharmacyId or userId)
      const chatToSelect = chats.find(
        (c) => c.pharmacy?.id === pharmacyId || c.otherUser?.id === owner.id
      );
      if (chatToSelect) {
        await selectChat(chatToSelect);
      }
      setIsWidgetOpen(true);
    } catch (error) {
      console.error("Error starting chat:", error);
      alert("Failed to start chat. Please try again.");
    }
  };

  const handleProfile = () => {
    // Implement profile navigation
    alert("Profile feature coming soon!");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Avatar with Status */}
        <div className="relative">
          <Avatar className="size-20 shadow-md border-2 border-white">
            {owner?.profilePhotoUrl ? (
              <AvatarImage src={owner.profilePhotoUrl} alt={owner.fullName} />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary-hover text-white text-lg font-bold">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          {owner?.isIdVerified && (
            <div className="absolute -bottom-1 -right-1 bg-transparent rounded-full p-1">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle2 size={14} className="text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Name and Verification */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">
              {owner?.fullName || "Pharmacy Owner"}
            </h3>
            {owner?.isIdVerified && (
              <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-600">Professional Pharmacist</p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2">
          <Button
            onClick={handleChat}
            className="w-full bg-primary hover:bg-primary/80 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition-all text-xs flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat with {owner?.fullName?.split(" ")[0] || "Owner"}</span>
          </Button>
          <Button
            onClick={handleProfile}
            variant="outline"
            className="w-full border border-primary text-primary hover:bg-primary/5 font-semibold px-4 py-2 rounded-lg shadow-sm transition-all text-xs flex items-center justify-center gap-2"
            title="View all listings by this owner"
          >
            <User2 className="w-4 h-4" />
            <span>View Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
