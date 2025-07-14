import {
  Heart,
  MapPin,
  Ruler,
  Phone,
  User,
  Map,
  Building2,
  TrendingUp,
} from "lucide-react";
import { useFav } from "../../store/useFav";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function PharmacyCard({ pharmacy, onViewDetails }) {
  const {
    isPharmacyFavorite,
    togglePharmacyFavorite,
    fetchFavorites,
    isLoading,
  } = useFav();

  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch favorites on component mount
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Check if this pharmacy is in favorites
  const isFavorite = isPharmacyFavorite(pharmacy.id);

  // Handle heart click
  const handleHeartClick = async (e) => {
    e.stopPropagation(); // Prevent card click

    // Start animation
    setIsAnimating(true);

    try {
      await togglePharmacyFavorite(pharmacy.id);

      // Show success toast
      if (isFavorite) {
        toast.success(`${pharmacy.name} removed from favorites`);
      } else {
        toast.success(`${pharmacy.name} added to favorites`);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("Failed to update favorites. Please try again.");
    } finally {
      // Stop animation after a short delay
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  // Image
  const imageUrl =
    pharmacy.imagesUrls && pharmacy.imagesUrls.length > 0
      ? pharmacy.imagesUrls[0]
      : "/public/avatars/client1.webp";

  // Price
  const price = pharmacy.pharmacyPrice
    ? `${Number(pharmacy.pharmacyPrice).toLocaleString()} EGP`
    : "Price on request";

  // Monthly Sales (if available)
  const monthlySales = pharmacy.monthlySales
    ? `${Number(pharmacy.monthlySales).toLocaleString()} EGP`
    : null;

  // Area (if available) - fallback to default if not provided
  const area = pharmacy.area || pharmacy.size || pharmacy.m2 || "94";

  // Address
  const address = [pharmacy.governorate, pharmacy.city, pharmacy.addressLine1]
    .filter(Boolean)
    .join(" / ");

  // Verified
  const isVerified = pharmacy.owner?.isIdVerified;

  return (
    <div
      className="bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group cursor-pointer w-full max-w-sm"
      onClick={() => onViewDetails && onViewDetails(pharmacy)}
    >
      {/* Image */}
      <div className="w-full h-48 bg-gray-200 rounded-t-xl overflow-hidden relative">
        <img
          src={imageUrl}
          alt={pharmacy.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />

        {/* Verified badge */}
        {isVerified && (
          <span className="absolute top-2 left-2 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded shadow">
            Verified
          </span>
        )}

        {/* Heart icon with animation */}
        <motion.button
          className={`absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow transition-all duration-200 hover:bg-white hover:shadow-lg ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleHeartClick}
          disabled={isLoading}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
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
                  isFavorite
                    ? "text-red-500 fill-red-500"
                    : "text-gray-400 hover:text-red-400"
                }`}
              />
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {pharmacy.name}
        </h3>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span className="truncate">
              {address || "Location not specified"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Building2 className="w-4 h-4" />
            <span>
              {pharmacy.saleType === "pharmacy_with_medicines"
                ? "With Medicines"
                : "Pharmacy Only"}
            </span>
          </div>
          {monthlySales && (
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>Monthly Sales</span>
            </div>
          )}
        </div>

        {/* Owner name */}
        {pharmacy.owner?.fullName && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
            <User className="w-4 h-4" />
            <span className="truncate">{pharmacy.owner.fullName}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-gray-900">
              {Number(pharmacy.pharmacyPrice).toLocaleString()} EGP
            </p>
            {monthlySales && (
              <p className="text-sm text-gray-500">
                Monthly Sales: {monthlySales}
              </p>
            )}
          </div>
          <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
