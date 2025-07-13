import React from "react";
import { Phone, MessageCircle, Star, Building2 } from "lucide-react";

export default function AdvertiserInfo({ owner }) {
  const handleCall = () => {
    // Handle call functionality
    console.log("Call advertiser");
  };

  const handleMessage = () => {
    // Handle message functionality
    console.log("Message advertiser");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start gap-4 mb-6">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          {owner?.profilePhotoUrl ? (
            <img
              src={owner.profilePhotoUrl}
              alt={owner.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <Building2 className="w-8 h-8 text-gray-400" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {owner?.fullName || "Pharmacy Owner"}
          </h3>
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm">Verified Seller</span>
          </div>
          <p className="text-sm text-gray-500">
            Member since{" "}
            {owner?.createdAt
              ? new Date(owner.createdAt).getFullYear()
              : "2023"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">3</p>
          <p className="text-sm text-gray-500">Active Listings</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">24h</p>
          <p className="text-sm text-gray-500">Response Time</p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleCall}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Phone className="w-4 h-4" />
          Call Now
        </button>
        <button
          onClick={handleMessage}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Send Message
        </button>
      </div>

      {/* Trust Indicators */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Verified
          </span>
          <span>•</span>
          <span>Quick Response</span>
          <span>•</span>
          <span>Trusted Seller</span>
        </div>
      </div>
    </div>
  );
}
