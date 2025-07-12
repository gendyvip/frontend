import { Card } from "../../components/ui/card";
import { Heart, MapPin, Ruler, Phone, User, Map } from "lucide-react";
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
  // Price per meter (if you have area and price)
  let pricePerMeter = null;
  if (pharmacy.pharmacyPrice && pharmacy.area) {
    const perMeter = Number(pharmacy.pharmacyPrice) / Number(pharmacy.area);
    pricePerMeter = `${Math.round(perMeter).toLocaleString()} EGP/m`;
  } else if (pharmacy.monthlySales) {
    pricePerMeter = `${Number(pharmacy.monthlySales).toLocaleString()} EGP/m`;
  }

  // Area (if available)
  const area = pharmacy.area || pharmacy.size || pharmacy.m2 || null;

  // Address
  const address = [pharmacy.governorate, pharmacy.city, pharmacy.addressLine1]
    .filter(Boolean)
    .join(" / ");

  // Verified
  const isVerified = pharmacy.owner?.isIdVerified;

  return (
    <Card
      className="bg-white rounded-xl shadow-md border border-gray-100 w-full min-w-[300px] max-w-[400px] mx-auto overflow-hidden flex flex-col cursor-pointer transition hover:shadow-lg hover:border-primary"
      onClick={() => onViewDetails && onViewDetails(pharmacy)}
    >
      {/* Image section */}
      <div className="relative aspect-video w-full bg-gray-100">
        <img
          src={imageUrl}
          alt={pharmacy.name}
          className="w-full h-54 object-cover"
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
      {/* Content section */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex flex-col gap-0.5 mb-1">
          <span className="text-xl font-bold text-primary leading-tight">
            {price}
          </span>
          {pricePerMeter && (
            <span className="text-xs text-gray-500">
              Sales per month:{" "}
              <span className="font-semibold text-primary">
                {pricePerMeter.replace("EGP/m", "EGP")}
              </span>
            </span>
          )}
        </div>
        <div className="text-base font-semibold text-gray-800 truncate mb-1">
          {pharmacy.name}
        </div>

        {/* Sale type badge */}
        <div className="flex items-center gap-2 mb-1">
          {pharmacy.saleType === "pharmacy_with_medicines" ? (
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
              With Medicines
            </span>
          ) : (
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
              Pharmacy Only
            </span>
          )}
        </div>
        {/* Owner name */}
        {pharmacy.owner?.fullName && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <User className="w-4 h-4" />
            <span className="truncate">{pharmacy.owner.fullName}</span>
          </div>
        )}
        {/* Location row */}
        <div className="flex items-center text-xs text-gray-500 gap-1 mb-1">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{address}</span>
        </div>

        {/* Area row */}
        {area && (
          <div className="flex items-center text-xs text-gray-500 gap-1">
            <Ruler className="w-4 h-4" />
            <span>{area} m²</span>
          </div>
        )}
      </div>
    </Card>
  );
}
