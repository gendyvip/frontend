import React from "react";
import {
  ChevronRight,
  Phone,
  MessageCircle,
  Share2,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ListingHeader({ pharmacy }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pharmacy.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleFavorite = () => {
    // Handle favorite functionality
    console.log("Favorite clicked");
  };

  return (
    <div className=" border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            to="/pharmacies-for-sale"
            className="hover:text-blue-600 transition-colors"
          >
            Pharmacies for Sale
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate">
            {pharmacy.name}
          </span>
        </nav>

        {/* Title and CTA Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {pharmacy.name}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {pharmacy.saleType === "pharmacy_with_medicines"
                  ? "With Medicines"
                  : "Pharmacy Only"}
              </span>
              <span>•</span>
              <span>License: {pharmacy.licenseNum || "N/A"}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleFavorite}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Heart className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleShare}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
