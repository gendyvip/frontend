import React, { useEffect } from "react";
import {
  CalendarX,
  Package,
  Banknote,
  ShieldCheck,
  MapPin,
  MessageCircle,
  CheckCircle2,
  Map,
  User2,
  Pill,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDeals } from "@/store/useDeals";
import { shallow } from "zustand/shallow";
import useChat from "../../store/useChat";
import { useAuth } from "../../store/useAuth";

export default function DealDetails() {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const deal = useDeals((state) => state.currentDeal);
  const isLoading = useDeals((state) => state.isLoading);
  const error = useDeals((state) => state.error);
  const fetchDeal = useDeals((state) => state.fetchDeal);
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

  useEffect(() => {
    if (dealId) {
      fetchDeal(dealId);
    }
  }, [dealId]);

  // Avatar logic (same as ProfileHeader)
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };
  const initials = getInitials(deal?.postedBy?.fullName);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-primary text-lg font-bold">
        Loading
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-red-600 text-lg font-bold">
        {error}
      </div>
    );
  }
  if (!deal) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500 text-lg font-bold">
        No Data With This Deal_ID
      </div>
    );
  }

  const handleChat = async () => {
    if (!currentUserId || !deal.postedBy) {
      alert("Please login to start a chat");
      return;
    }

    try {
      // Start chat with the deal poster
      await startChat(currentUserId, deal.postedBy.id, deal.id, {
        fullName: deal.postedBy.fullName,
        profilePhotoUrl: deal.postedBy.profilePhotoUrl,
        role: deal.postedBy.role || "User",
      });

      // Refresh chat list
      await loadUserChats();

      // Find the new chat in the list (by dealId or userId)
      const chatToSelect = chats.find(
        (c) => c.deal?.id === deal.id || c.otherUser?.id === deal.postedBy.id
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

  const handleProfile = () => {
    navigate(
      `/profile/${deal.postedBy.id}`
    );
  };

  // Google Maps direction link
  const pharmacyAddress = `${deal.pharmacy.addressLine1} ${deal.pharmacy.addressLine2} ${deal.pharmacy.city} ${deal.pharmacy.governorate}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    pharmacyAddress
  )}`;

  return (
    <div className="min-h-screen py-6 px-2 sm:px-4 flex  justify-center items-start">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column: Medicine & Pharmacy Info */}
        <main className="md:col-span-2 flex flex-col gap-6 md:gap-8 order-1 md:order-1">
          {/* Medicine Info Section */}
          <section className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 flex flex-col gap-4 border-b-4 border-primary/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-primary mb-1">
                  {deal.medicineName}
                </h1>
                <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  {deal.dealType}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2 md:mt-0">
                <ShieldCheck
                  className={`w-5 h-5 ${
                    deal.isValid ? "text-green-500" : "text-gray-400"
                  }`}
                />
                <span className="text-xs text-gray-600 font-medium">
                  {deal.isValid ? "Valid" : "Not Valid"}
                </span>
                <span className="ml-4 text-xs text-gray-500">
                  {deal.dosageForm}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Package className="w-5 h-5" />
                  <span className="font-semibold">Quantity:</span>
                  <span>{deal.quantity}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Banknote className="w-5 h-5" />
                  <span className="font-semibold">Price:</span>
                  <span>{deal.price} EGP</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CalendarX className="w-5 h-5" />
                  <span className="font-semibold">Expiry:</span>
                  <span>{new Date(deal.expiryDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-semibold">Box Status:</span>
                  <span
                    className={
                      deal.boxStatus === "damaged"
                        ? "text-red-500"
                        : "text-green-600"
                    }
                  >
                    {deal.boxStatus}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-semibold">Status:</span>
                  <span
                    className={
                      deal.isClosed ? "text-red-500" : "text-green-600"
                    }
                  >
                    {deal.isClosed ? "Closed" : "Open"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="bg-primary/5 rounded-lg p-4 h-full flex flex-col justify-center">
                  <h2 className="text-lg font-semibold text-primary mb-2">
                    Description
                  </h2>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {deal.description}
                  </p>
                </div>
              </div>
            </div>
            {/* Mobile Chat Button */}
            <Button
              onClick={handleChat}
              className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white font-semibold px-6 py-3 rounded-xl shadow transition-all text-base mt-4 w-full justify-center block md:hidden"
            >
              <MessageCircle className="w-5 h-5" />
              CHAT WITH DOCTOR
            </Button>
          </section>

          {/* Pharmacy Info Section */}
          <section className="bg-gray-50 rounded-2xl p-4 sm:p-6 flex flex-col gap-3 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-bold text-primary text-lg">
                Pharmacy Info
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-2">
              <div>
                <span className="font-semibold">Name:</span>{" "}
                {deal.pharmacy.name}
              </div>
              <div>
                <span className="font-semibold">License #:</span>{" "}
                {deal.pharmacy.licenseNum}
              </div>
              <div>
                <span className="font-semibold">Phone:</span>{" "}
                {deal.pharmacy.pharmacyPhone}
              </div>
              <div>
                <span className="font-semibold">Working Hours:</span>{" "}
                {deal.pharmacy.startHour} - {deal.pharmacy.endHour}
              </div>
              <div className="col-span-2">
                <span className="font-semibold">Address:</span>{" "}
                {deal.pharmacy.addressLine1} {deal.pharmacy.addressLine2}
              </div>
              <div>
                <span className="font-semibold">City:</span>{" "}
                {deal.pharmacy.city}
              </div>
              <div>
                <span className="font-semibold">Governorate:</span>{" "}
                {deal.pharmacy.governorate}
              </div>
              <div>
                <span className="font-semibold">Zip Code:</span>{" "}
                {deal.pharmacy.zipCode}
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white font-semibold px-5 py-2 rounded-lg shadow transition-all text-sm"
              >
                <Map className="w-4 h-4" />
                Get Directions
              </a>
            </div>
          </section>
        </main>

        {/* Right Column: Doctor Info (on mobile: order-last) */}
        <aside className="md:col-span-1 flex flex-col items-center md:items-stretch gap-6 order-2 md:order-2 mt-8 md:mt-0 md:sticky md:top-8">
          <section className="bg-white border rounded-2xl p-6 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 mb-2">
              <User2 className="w-5 h-5 text-primary" />
              <span className="font-bold text-primary text-lg">
                Doctor Info
              </span>
            </div>
            <Avatar className="size-20 shadow-md mb-2">
              {deal.postedBy.profilePhotoUrl ? (
                <AvatarImage
                  src={deal.postedBy.profilePhotoUrl}
                  alt={deal.postedBy.fullName}
                />
              ) : (
                <AvatarFallback>{initials}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-primary">
                {deal.postedBy.fullName}
              </span>
              {deal.postedBy.isIdVerified && (
                <CheckCircle2
                  className="w-5 h-5 text-green-500"
                  title="Verified"
                />
              )}
            </div>
            <Button
              onClick={handleChat}
              className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white font-semibold px-6 py-3 rounded-xl shadow transition-all text-base mt-3 w-full justify-center hidden md:flex"
            >
              <MessageCircle className="w-5 h-5" />
              Chat with {deal.postedBy.fullName.split(" ")[0]}
            </Button>
            <Button
              onClick={handleProfile}
              className="flex items-center gap-2 border border-primary text-primary hover:bg-primary/5 font-semibold px-6 py-3 rounded-xl shadow-sm transition-all text-base mt-2 w-full justify-center"
              title="View all deals by this doctor"
              variant="outline"
            >
              <User2 className="w-5 h-5" />
              View Doctor Profile
            </Button>
          </section>
        </aside>
      </div>
    </div>
  );
}
