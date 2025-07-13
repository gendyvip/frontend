import React, { useRef } from "react";
import {
  MapPin,
  Ruler,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function RelatedListings({ pharmacy }) {
  const scrollContainerRef = useRef(null);

  // Mock 4 similar pharmacies using the current pharmacy data
  const related = [1, 2, 3, 4].map((i) => ({
    ...pharmacy,
    id: pharmacy.id + "-rel" + i,
    name: `Pharmacy ${i} - ${pharmacy.name}`,
    pharmacyPrice: Math.round(
      pharmacy.pharmacyPrice * (0.8 + Math.random() * 0.4)
    ), // Vary price
  }));

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Similar Listings</h2>
          <p className="text-sm text-gray-500">
            Other pharmacies you might like
          </p>
        </div>
      </div>

      {/* Scrollable Container with Navigation */}
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide px-4 py-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {related.map((pharm) => (
            <Link
              key={pharm.id}
              to={`/pharmacy/${pharm.id}`}
              className="flex-shrink-0 w-80 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
            >
              {/* Image */}
              <div className="w-full h-48 bg-gray-200 rounded-t-xl overflow-hidden">
                {pharm.imagesUrls && pharm.imagesUrls[0] ? (
                  <img
                    src={pharm.imagesUrls[0]}
                    alt={pharm.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {pharm.name}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">
                      {pharm.addressLine1 || "Location not specified"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Ruler className="w-4 h-4" />
                    <span>94 m²</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    <span>
                      {pharm.saleType === "pharmacy_with_medicines"
                        ? "With Medicines"
                        : "Pharmacy Only"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {Number(pharm.pharmacyPrice).toLocaleString()} EGP
                    </p>
                    <p className="text-sm text-gray-500">
                      {Math.round(pharm.pharmacyPrice / 94).toLocaleString()}{" "}
                      EGP/m²
                    </p>
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
            </Link>
          ))}
        </div>

        {/* Custom Scrollbar */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>

      {/* View All Button */}
      <div className="text-center mt-6">
        <Link
          to="/pharmacies-for-sale"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          View All Listings
          <svg
            className="w-4 h-4"
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
        </Link>
      </div>
    </div>
  );
}
