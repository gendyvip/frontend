import React from "react";
import {
  Building2,
  Ruler,
  Key,
  TrendingUp,
  CreditCard,
  Calendar,
  MapPin,
  DollarSign,
} from "lucide-react";

export default function PharmacyDetailsTable({ pharmacy }) {
  const pricePerSqm =
    pharmacy.pharmacyPrice && pharmacy.area
      ? Math.round(pharmacy.pharmacyPrice / pharmacy.area)
      : null;

  const details = [
    {
      icon: Building2,
      label: "Status",
      value: "Semi Finished",
      color: "text-blue-600",
    },
    {
      icon: Ruler,
      label: "Size",
      value: "94 m²",
      color: "text-green-600",
    },
    {
      icon: Key,
      label: "License Number",
      value: pharmacy.licenseNum || "N/A",
      color: "text-purple-600",
    },
    {
      icon: TrendingUp,
      label: "Monthly Sales",
      value: pharmacy.monthlySales
        ? Number(pharmacy.monthlySales).toLocaleString() + " EGP"
        : "Not specified",
      color: "text-orange-600",
    },
    {
      icon: CreditCard,
      label: "Payment Type",
      value: "Cash / Installments",
      color: "text-indigo-600",
    },
    {
      icon: Calendar,
      label: "Date Posted",
      value: pharmacy.createdAt
        ? new Date(pharmacy.createdAt).toLocaleDateString()
        : "Recently",
      color: "text-gray-600",
    },
    {
      icon: MapPin,
      label: "Location",
      value: pharmacy.addressLine1 || "Not specified",
      color: "text-red-600",
    },
    {
      icon: DollarSign,
      label: "Price per m²",
      value: pricePerSqm ? `${pricePerSqm.toLocaleString()} EGP` : "N/A",
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Pharmacy Details</h2>
          <p className="text-sm text-gray-500">
            Complete information about this pharmacy
          </p>
        </div>
      </div>

      {/* Price Section */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {details.map((detail, index) => {
          const IconComponent = detail.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-gray-200`}
              >
                <IconComponent className={`w-4 h-4 ${detail.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {detail.label}
                </p>
                <p className="text-base font-semibold text-gray-900 truncate">
                  {detail.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
