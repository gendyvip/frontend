import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Package, Tag, Pill, Clock, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/store/useAuth";
import { useFav } from "@/store/useFav";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

function MedicineDealCard({ deal }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDealFavorite, toggleDealFavorite, fetchFavorites, isLoading } =
    useFav();

  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch favorites on component mount
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Handle incomplete deal data
  if (!deal || !deal.id) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="text-center text-gray-500">
          <p>Deal information unavailable</p>
        </div>
      </div>
    );
  }

  // Check if this deal is in favorites
  const isFavorite = isDealFavorite(deal.id);

  // Handle heart click
  const handleHeartClick = async (e) => {
    e.stopPropagation(); // Prevent card click

    // Start animation
    setIsAnimating(true);

    try {
      await toggleDealFavorite(deal.id);

      // Show success toast
      if (isFavorite) {
        toast.success(`${deal.medicineName} removed from favorites`);
      } else {
        toast.success(`${deal.medicineName} added to favorites`);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Failed to update favorites. Please try again.");
    } finally {
      // Stop animation after a short delay
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleViewDetails = (dealId) => {
    navigate(`/all-deals/${dealId}`);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Helper function to format created date with time
  const formatCreatedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper function to determine status
  const getStatus = (deal) => {
    if (deal.isClosed) return "closed";
    if (!deal.isValid) return "expired";
    return "active";
  };

  // Helper function to get pharmacy avatar
  const getPharmacyAvatar = (pharmacy) => {
    if (!pharmacy) return "/public/avatars/client1.webp";
    return pharmacy.imagesUrls && pharmacy.imagesUrls.length > 0
      ? pharmacy.imagesUrls[0]
      : "/public/avatars/client1.webp"; // fallback avatar
  };

  const status = getStatus(deal);
  const isOwnDeal = deal.postedBy && deal.postedBy.id === user;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group relative">
      <div className="p-6 flex-1 flex flex-col">
        {/* Header with badge and heart icon */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-bold text-lg text-gray-900 leading-tight pr-2">
              {deal.medicineName || "Medicine Name Not Available"}
            </h2>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {/* Heart icon with animation */}
            <motion.button
              className={`bg-white/80 rounded-full p-1 shadow transition-all duration-200 hover:bg-white hover:shadow-lg ${
                isLoading || isOwnDeal ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleHeartClick}
              disabled={isLoading || isOwnDeal}
              whileHover={!isOwnDeal ? { scale: 1.1 } : {}}
              whileTap={!isOwnDeal ? { scale: 0.9 } : {}}
              animate={
                isAnimating
                  ? {
                      scale: [1, 1.3, 1],
                      rotate: [0, 10, -10, 0],
                    }
                  : {}
              }
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              title={isOwnDeal ? "You cannot favorite your own deal" : ""}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isFavorite ? "filled" : "empty"}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                  }}
                >
                  <Heart
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isOwnDeal
                        ? "text-gray-300"
                        : isFavorite
                        ? "text-red-500 fill-red-500"
                        : "text-gray-400 hover:text-red-400"
                    }`}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.button>
            <Badge
              className={`${
                deal.dealType === "sell"
                  ? "bg-purple-50 text-purple-700 border-purple-200"
                  : deal.dealType === "exchange"
                  ? "bg-amber-50 text-amber-400 border-amber-200"
                  : "bg-zinc-50 text-zinc-700 border-zinc-200"
              } border font-medium capitalize text-xs px-3 py-1`}
            >
              {deal.dealType === "both" ? "Sell / Exchange" : deal.dealType}
            </Badge>
          </div>
        </div>

        {/* Deal info with icons - rearranged by importance */}
        <div className="space-y-3 mb-4">
          {/* Price - most important for buyers */}
          {(deal.dealType === "sell" ||
            deal.dealType === "exchange" ||
            deal.dealType === "both") &&
            deal.price && (
              <div className="flex items-center text-gray-600 text-sm">
                <Tag size={16} className="mr-2 text-gray-400" />
                <span className="font-medium">Price:</span>
                <span className="ml-1 text-gray-900 font-semibold">
                  EGP {parseFloat(deal.price).toFixed(2)}
                </span>
              </div>
            )}
          {/* Quantity - important for availability */}
          {deal.quantity && (
            <div className="flex items-center text-gray-600 text-sm">
              <Package size={16} className="mr-2 text-gray-400" />
              <span className="font-medium">Quantity:</span>
              <span className="ml-1 text-gray-900">{deal.quantity}</span>
            </div>
          )}
          {/* Expiry Date - critical for medicine safety */}
          {deal.expiryDate && (
            <div className="flex items-center text-gray-600 text-sm">
              <Calendar size={16} className="mr-2 text-gray-400" />
              <span className="font-medium">Expires:</span>
              <span className="ml-1 text-gray-900">
                {formatDate(deal.expiryDate)}
              </span>
            </div>
          )}
          {/* Dosage Form - important for medicine type */}
          {deal.dosageForm && (
            <div className="flex items-center text-gray-600 text-sm">
              <Pill size={16} className="mr-2 text-gray-400" />
              <span className="font-medium">Dosage Form:</span>
              <span className="ml-1 text-gray-900">
                {deal.dosageForm.charAt(0).toUpperCase() +
                  deal.dosageForm.slice(1)}
              </span>
            </div>
          )}
          {/* Posted Date - less important, shown last */}
          {deal.createdAt && (
            <div className="flex items-center text-gray-600 text-sm">
              <Clock size={16} className="mr-2 text-gray-400" />
              <span className="font-medium">Posted:</span>
              <span className="ml-1 text-gray-900">
                {formatCreatedDate(deal.createdAt)}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {deal.description && (
          <div className="text-gray-700 text-sm mb-4 flex-1 leading-relaxed">
            {deal.description}
          </div>
        )}

        {/* Pharmacy info */}
        {deal.pharmacy && (
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <div className="relative">
              <img
                src={getPharmacyAvatar(deal.pharmacy)}
                alt="avatar"
                className="w-8 h-8 rounded-full border-2 border-gray-200 object-cover"
              />
              {deal.pharmacy.licenseNum && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {deal.pharmacy.name || "Unknown Pharmacy"}
                </span>
              </div>
              <div className="text-xs text-gray-500 space-y-0.5">
                {(deal.pharmacy.governorate || deal.pharmacy.city) && (
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="capitalize">
                      {deal.pharmacy.governorate && deal.pharmacy.city
                        ? `${deal.pharmacy.governorate}, ${deal.pharmacy.city}`
                        : deal.pharmacy.governorate ||
                          deal.pharmacy.city ||
                          "Location not specified"}
                    </span>
                  </div>
                )}
                {deal.pharmacy.addressLine1 && (
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="truncate">
                      {deal.pharmacy.addressLine1}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action button */}
      <div className="p-6 pt-0">
        <Button
          className="w-full transition-colors duration-200"
          variant="outline"
          onClick={() => handleViewDetails(deal.id)}
          disabled={isOwnDeal}
          title={isOwnDeal ? "You cannot view details of your own deal" : ""}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}

export default MedicineDealCard;
