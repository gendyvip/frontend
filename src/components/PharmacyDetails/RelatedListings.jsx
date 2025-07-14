import React, { useRef, useEffect, useState } from "react";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import PharmacyCard from "../../pages/PharmaciesForSale/PharmacyCard";
import { getRelatedPharmacies } from "../../api/pharmacies";

export default function RelatedListings({ pharmacy }) {
  const scrollContainerRef = useRef(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!pharmacy?.id) return;
    setLoading(true);
    setError("");
    getRelatedPharmacies(pharmacy.id)
      .then((res) => {
        let fetched = res.data?.pharmacies || [];
        // Exclude current user's own pharmacies
        let currentUserId = null;
        try {
          const user = localStorage.getItem("user");
          if (user) {
            const parsed = JSON.parse(user);
            currentUserId =
              typeof parsed === "object" && parsed.id ? parsed.id : parsed;
          }
        } catch {
          /* ignore */
        }
        if (currentUserId) {
          fetched = fetched.filter(
            (pharm) => pharm.owner?.id !== currentUserId
          );
        }
        setRelated(fetched);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load related pharmacies");
        setLoading(false);
      });
  }, [pharmacy?.id]);

  // Always define displayRelated before any return
  let displayRelated = related;
  if (!loading && !error && related.length === 0) {
    displayRelated = [
      {
        id: "mock3",
        name: "Test Pharmacy 3",
        pharmacyPrice: 105000,
        city: "Cairo",
        governorate: "Cairo",
        addressLine1: "789 Sample Rd",
        imagesUrls: ["https://randomuser.me/api/portraits/men/3.jpg"],
        owner: { fullName: "Dr. Samir" },
        saleType: "pharmacy_with_medicines",
        monthlySales: 9500,
        isForSale: true,
      },
    ];
  }

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

  // Enhanced logic: 1 = just card, 2 = row, 3 = centered row, 4+ = scroll
  if (!loading && !error && displayRelated.length === 1) {
    const pharm = displayRelated[0];
    return (
      <div className="py-8">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900">Similar Listings</h2>
          <p className="text-sm text-gray-500">
            Other pharmacies you might like
          </p>
        </div>
        <PharmacyCard
          pharmacy={pharm}
          onViewDetails={(pharmacy) => {
            window.location.href = `/pharmacy/${pharmacy.id}`;
          }}
        />
      </div>
    );
  }

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

      {/* Loading/Error States */}
      {loading && (
        <div className="py-8 text-center text-blue-500 font-semibold">
          Loading related pharmacies...
        </div>
      )}
      {error && !loading && (
        <div className="py-8 text-center text-red-500 font-semibold">
          {error}
        </div>
      )}

      {/* 2 = row (scroll on sm/md), 3 = centered row (scroll on sm/md), 4+ = scroll with arrows */}
      {!loading &&
        !error &&
        displayRelated.length > 1 &&
        displayRelated.length < 4 && (
          <>
            <div
              className={`
              flex gap-6 py-4
              overflow-x-auto scrollbar-hide
              sm:overflow-x-auto sm:px-2
              lg:overflow-x-visible lg:px-0
              ${
                displayRelated.length === 3
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }
            `}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {displayRelated.map((pharm) => (
                <div key={pharm.id} className="flex-shrink-0">
                  <PharmacyCard
                    pharmacy={pharm}
                    onViewDetails={(pharmacy) => {
                      window.location.href = `/pharmacy/${pharmacy.id}`;
                    }}
                  />
                </div>
              ))}
            </div>
            <style>{`
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
          </>
        )}
      {!loading && !error && displayRelated.length >= 4 && (
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
            {displayRelated.map((pharm) => (
              <div key={pharm.id} className="flex-shrink-0">
                <PharmacyCard
                  pharmacy={pharm}
                  onViewDetails={(pharmacy) => {
                    window.location.href = `/pharmacy/${pharmacy.id}`;
                  }}
                />
              </div>
            ))}
          </div>
          {/* Custom Scrollbar */}
          <style>{`
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
        </div>
      )}
      {/* No related pharmacies (should not show with mock data) */}
      {!loading && !error && displayRelated.length === 0 && (
        <div className="py-8 text-center text-gray-500 font-semibold">
          No related pharmacies found.
        </div>
      )}

      {/* View All Button */}
      {displayRelated.length > 1 && (
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
      )}
    </div>
  );
}
