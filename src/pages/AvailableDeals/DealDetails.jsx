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
  Clock,
  AlertCircle,
  Phone,
  Mail,
  ArrowLeft,
  Box as BoxIcon,
  Hash,
  Tag,
  Info,
  Layers,
  List,
  Building2,
  Globe,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDeals } from "@/store/useDeals";
import { shallow } from "zustand/shallow";
import useChat from "../../store/useChat";
import { useAuth } from "../../store/useAuth";
import CornerAd from "@/components/ui/CornerAd";

export default function DealDetails() {
  const { id } = useParams();
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
    if (id) {
      fetchDeal(id);
    }
  }, [id]);

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
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Loading deal details...
          </p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-bold">{error}</p>
        </div>
      </div>
    );
  }
  if (!deal) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-bold">
            No Data With This Deal_ID
          </p>
        </div>
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
      await startChat(currentUserId, deal.postedBy.id, deal.id, "deal", {
        fullName: deal.postedBy.fullName,
        profilePhotoUrl: deal.postedBy.profilePhotoUrl,
        role: deal.postedBy.role || "User",
      });

      // Refresh chat list
      await loadUserChats();

      // Find the new chat in the list (by id or userId)
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
    navigate(`/pharmacists/${deal.postedBy.id}`);
  };

  // Google Maps direction link
  const pharmacyAddress = `${deal.pharmacy.addressLine1} ${deal.pharmacy.addressLine2} ${deal.pharmacy.city} ${deal.pharmacy.governorate}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    pharmacyAddress
  )}`;

  // Calculate time since posting
  const getTimeSincePosted = () => {
    const postedDate = new Date(deal.createdAt);
    const now = new Date();
    const diffInHours = Math.floor((now - postedDate) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <CornerAd position="dealDetails" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <a href="/" className="hover:text-blue-600 transition-colors">
            Home
          </a>
          <ChevronRight className="w-4 h-4" />
          <a href="/deals" className="hover:text-blue-600 transition-colors">
            Deals
          </a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate">
            {deal.medicineName}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Medicine Information */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 sm:p-6">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Pill className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      {deal.medicineName}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Medicine Information
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Medicine Information */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900  flex items-center gap-2">
                      <Info className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <span className="sm:inline">Medicine Information</span>
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <List className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                          <span className="font-medium text-gray-700 text-sm sm:text-base">
                            Quantity
                          </span>
                        </div>
                        <span className="font-bold text-primary text-sm sm:text-base">
                          {deal.quantity}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Banknote className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                          <span className="font-medium text-gray-700 text-sm sm:text-base">
                            Price
                          </span>
                        </div>
                        <span className="font-bold text-green-600 text-sm sm:text-base">
                          EGP{Number(deal.price).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <CalendarX className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                          <span className="font-medium text-gray-700 text-sm sm:text-base">
                            Expiry
                          </span>
                        </div>
                        <span className="font-medium text-gray-900 text-sm sm:text-base">
                          {new Date(deal.expiryDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <BoxIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          <span className="font-medium text-gray-700 text-sm sm:text-base">
                            Box Status
                          </span>
                        </div>
                        <Badge
                          variant={
                            deal.boxStatus === "damaged"
                              ? "destructive"
                              : "default"
                          }
                          className={`font-medium text-xs ${
                            deal.boxStatus === "damaged"
                              ? "bg-red-100 text-red-700 border-red-200"
                              : "bg-green-100 text-green-700 border-green-200"
                          }`}
                        >
                          {deal.boxStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900  flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <span className="sm:inline">Deal Details</span>
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                          <span className="font-medium text-gray-700 text-sm sm:text-base">
                            Type
                          </span>
                        </div>
                        <span className="font-medium text-gray-900 text-sm sm:text-base">
                          {deal.dealType}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Pill className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                          <span className="font-medium text-gray-700 text-sm sm:text-base">
                            Form
                          </span>
                        </div>
                        <span className="font-medium text-gray-900 text-sm sm:text-base">
                          {deal.dosageForm}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                          <span className="font-medium text-gray-700 text-sm sm:text-base">
                            Posted
                          </span>
                        </div>
                        <span className="font-medium text-gray-900 text-sm sm:text-base">
                          {getTimeSincePosted()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pharmacy Information */}
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                      Pharmacy Information
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Location and contact details
                    </p>
                  </div>
                </CardTitle>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold px-3 sm:px-4 py-2 rounded-lg shadow-sm transition-all text-xs sm:text-sm mt-4 sm:mt-0 ml-auto"
                >
                  <Map className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Get Directions</span>
                  <span className="sm:hidden">Directions</span>
                </a>
              </CardHeader>
              <CardContent className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <User2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mb-5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
                          Name
                        </span>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {deal.pharmacy.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mb-5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
                          License #
                        </span>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {deal.pharmacy.licenseNum}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mb-5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
                          Phone
                        </span>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {deal.pharmacy.pharmacyPhone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mb-5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
                          Hours
                        </span>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {deal.pharmacy.startHour} - {deal.pharmacy.endHour}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mb-5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
                          Address
                        </span>
                        <p className="font-semibold text-gray-900 text-xs sm:text-sm leading-relaxed">
                          {deal.pharmacy.addressLine1}{" "}
                          {deal.pharmacy.addressLine2}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                        <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600 mb-5" />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
                            City
                          </span>
                          <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                            {deal.pharmacy.city}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                        <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-teal-600 mb-5" />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
                            Governorate
                          </span>
                          <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                            {deal.pharmacy.governorate}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <Map className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mb-5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block">
                          Zip Code
                        </span>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {deal.pharmacy.zipCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Doctor Information */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 sm:top-8">
              <Card className="shadow-sm border border-gray-200">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <User2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        Pharmacist Information
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Deal posted by
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                    {/* Avatar with Status */}
                    <div className="relative">
                      <Avatar className="size-16 sm:size-20 shadow-md border-2 border-white">
                        {deal.postedBy.profilePhotoUrl ? (
                          <AvatarImage
                            src={deal.postedBy.profilePhotoUrl}
                            alt={deal.postedBy.fullName}
                          />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary-hover text-white text-sm sm:text-lg font-bold">
                            {initials}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {deal.postedBy.isIdVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-transparent rounded-full  p-1  ">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle2
                              size={10}
                              className="text-white sm:w-3 sm:h-3"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Doctor Name and Verification */}
                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">
                          {deal.postedBy.fullName}
                        </h3>
                        {deal.postedBy.isIdVerified && (
                          <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                            <CheckCircle2 className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                            <span className="sm:inline">Verified</span>
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Professional Pharmacist
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full space-y-2 sm:space-y-3">
                      <Button
                        onClick={handleChat}
                        className="w-full bg-primary hover:bg-primary/80 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-sm transition-all text-xs sm:text-base flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="xl:inline">
                          Chat with {deal.postedBy.fullName.split(" ")[0]}
                        </span>
                      </Button>

                      <Button
                        onClick={handleProfile}
                        variant="outline"
                        className="w-full border border-primary text-primary hover:bg-primary/5 font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-sm transition-all text-xs sm:text-base flex items-center justify-center gap-2"
                        title="View all deals by this doctor"
                      >
                        <User2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">View Profile</span>
                        <span className="sm:hidden">Profile</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
