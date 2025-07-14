import PharmacyCard from "./PharmacyCard";
import { Package } from "lucide-react";

export default function PharmaciesList({ pharmacies, loading, onViewDetails }) {
  if (loading) {
    return (
      <>
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md border border-gray-100 w-full min-w-[300px] max-w-[400px] mx-auto overflow-hidden flex flex-col animate-pulse"
          >
            {/* Image skeleton */}
            <div className="relative aspect-video w-full bg-gray-200">
              <div
                className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_1.5s_infinite]"
                style={{ backgroundSize: "200% 100%" }}
              />
            </div>
            {/* Content skeleton */}
            <div className="p-4 flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-6 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-12 bg-gray-200 rounded" />
              </div>
              <div className="h-5 w-32 bg-gray-200 rounded mb-1" />
              <div className="h-4 w-40 bg-gray-200 rounded mb-1" />
              <div className="flex items-center gap-2 mb-1">
                <div className="h-4 w-4 bg-gray-200 rounded-full" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded-full" />
                <div className="h-4 w-12 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </>
    );
  }
  if (!pharmacies.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24   mx-auto w-full min-h-[300px]">
        <div className="bg-primary/10 rounded-full p-4 mb-4">
          <Package className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">
          No Pharmacies Found
        </h2>
        <p className="text-gray-500 text-base mb-2 text-center max-w-md">
          We couldn't find any pharmacies for sale matching your criteria. Try
          adjusting your filters or check back later!
        </p>
      </div>
    );
  }
  return (
    <>
      {pharmacies.map((pharmacy) => (
        <PharmacyCard
          key={pharmacy.id}
          pharmacy={pharmacy}
          onViewDetails={onViewDetails}
        />
      ))}
    </>
  );
}
