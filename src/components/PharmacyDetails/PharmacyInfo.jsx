import React from "react";
import { Heart, Share2, Building2, MapPin, Calendar } from "lucide-react";

export default function PharmacyInfo({ pharmacy }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Building2 className="w-6 h-6 text-gray-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              {pharmacy.name}
            </h1>
          </div>

          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {pharmacy.addressLine1 || "Location not specified"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                Listed{" "}
                {pharmacy.createdAt
                  ? new Date(pharmacy.createdAt).toLocaleDateString()
                  : "Recently"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {pharmacy.saleType === "pharmacy_with_medicines" ? (
            <span className="bg-green-50 text-green-700 text-sm font-medium px-3 py-1.5 rounded-full border border-green-200">
              With Medicines
            </span>
          ) : (
            <span className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full border border-blue-200">
              Pharmacy Only
            </span>
          )}
          <button className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Price Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Asking Price</p>
            <p className="text-3xl font-bold text-gray-900">
              {Number(pharmacy.pharmacyPrice).toLocaleString()} EGP
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">License Number</p>
            <p className="text-lg font-semibold text-gray-900">
              {pharmacy.licenseNum || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
