import React from "react";
import {
  Building2,
  Ruler,
  MapPin,
  CreditCard,
  Calendar,
  TrendingUp,
} from "lucide-react";

export default function PriceAndDetails({ pharmacy }) {
  const pricePerSqm =
    pharmacy.pharmacyPrice && pharmacy.area
      ? Math.round(pharmacy.pharmacyPrice / pharmacy.area)
      : null;

  const keyDetails = [
    {
      icon: Ruler,
      label: "Area",
      value: "94 m²",
      color: "text-blue-600",
    },
    {
      icon: Building2,
      label: "Status",
      value: "Semi Finished",
      color: "text-green-600",
    },
    {
      icon: TrendingUp,
      label: "Price/m²",
      value: pricePerSqm ? `${pricePerSqm.toLocaleString()} EGP` : "N/A",
      color: "text-purple-600",
    },
    {
      icon: CreditCard,
      label: "Payment",
      value: "Cash / Installments",
      color: "text-orange-600",
    },
    {
      icon: MapPin,
      label: "Location",
      value: pharmacy.addressLine1 || "Not specified",
      color: "text-red-600",
    },
    {
      icon: Calendar,
      label: "Listed",
      value: pharmacy.createdAt
        ? new Date(pharmacy.createdAt).toLocaleDateString()
        : "Recently",
      color: "text-gray-600",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      {/* Price Section */}
      <div className="mb-8">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-4xl font-bold text-gray-900">
            {Number(pharmacy.pharmacyPrice).toLocaleString()}
          </span>
          <span className="text-xl text-gray-600">EGP</span>
        </div>
        {pricePerSqm && (
          <p className="text-gray-500">
            {pricePerSqm.toLocaleString()} EGP per m²
          </p>
        )}
      </div>

      {/* Key Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {keyDetails.map((detail, index) => {
          const IconComponent = detail.icon;
          return (
            <div key={index} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center`}
              >
                <IconComponent className={`w-5 h-5 ${detail.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  {detail.label}
                </p>
                <p className="text-gray-900 font-semibold truncate">
                  {detail.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Sales Info */}
      {pharmacy.monthlySales && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Monthly Sales</p>
              <p className="text-blue-900 font-bold">
                {Number(pharmacy.monthlySales).toLocaleString()} EGP
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
