import React, { useEffect, useState, Suspense, lazy } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../store/useAuth";
import { getPharmacyById } from "../../api/pharmacies";
import CornerAd from "../../components/ui/CornerAd";

// Lazy load components for better performance
const ListingHeader = lazy(() =>
  import("../../components/PharmacyDetails/ListingHeader")
);
const ImageGallery = lazy(() =>
  import("../../components/PharmacyDetails/ImageGallery")
);

const PharmacyDetailsTable = lazy(() =>
  import("../../components/PharmacyDetails/PharmacyDetailsTable")
);
const MapSection = lazy(() =>
  import("../../components/PharmacyDetails/MapSection")
);
const AdvertiserInfo = lazy(() =>
  import("../../components/PharmacyDetails/AdvertiserInfo")
);

const RelatedListings = lazy(() =>
  import("../../components/PharmacyDetails/RelatedListings")
);

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-background">
    {/* Header Skeleton */}
    <div className=" border-b border-gray-100 dark:border-border bg-white dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-4 bg-gray-200 dark:bg-card rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="h-8 bg-gray-200 dark:bg-card rounded w-2/3 mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 dark:bg-card rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
    {/* Main Content Skeleton */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Row - Image Gallery and Advertiser Info */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="h-96 bg-gray-200 dark:bg-card rounded-2xl animate-pulse"></div>
        </div>
        <div>
          <div className="h-96 bg-gray-200 dark:bg-card rounded-2xl animate-pulse"></div>
        </div>
      </div>
      {/* Full Width Components */}
      <div className="space-y-8">
        {/* Detailed Information and Map Section - Side by Side */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="h-64 bg-gray-200 dark:bg-card rounded-2xl animate-pulse"></div>
          </div>
          <div>
            <div className="h-64 bg-gray-200 dark:bg-card rounded-2xl animate-pulse"></div>
          </div>
        </div>
        <div className="h-64 bg-gray-200 dark:bg-card rounded-2xl animate-pulse"></div>
      </div>
    </div>
  </div>
);

// Component Wrapper with Suspense
const SuspenseWrapper = ({ children }) => (
  <Suspense
    fallback={
      <div className="h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
    }
  >
    {children}
  </Suspense>
);

export default function PharmacyDetails() {
  const { id } = useParams();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || !isAuthenticated) return;
    setLoading(true);
    setError("");
    getPharmacyById(id)
      .then((data) => {
        setPharmacy(data.data?.pharmacy || null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load pharmacy details");
        setLoading(false);
      });
  }, [id, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-600 dark:text-gray-300 text-lg font-medium bg-gray-50 dark:bg-background">
        Checking authentication...
      </div>
    );
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-red-600 dark:text-red-400 text-lg font-medium bg-gray-50 dark:bg-background">
        {error}
      </div>
    );
  }

  if (!pharmacy) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500 dark:text-gray-400 text-lg font-medium bg-gray-50 dark:bg-background">
        No pharmacy found with this ID.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <CornerAd position="pharmacyDetails" />
      {/* Header */}
      <SuspenseWrapper>
        <ListingHeader pharmacy={pharmacy} />
      </SuspenseWrapper>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Row - Image Gallery and Advertiser Info */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Image Gallery - Takes 2/3 of the width */}
          <div className="lg:col-span-2">
            <SuspenseWrapper>
              <ImageGallery images={pharmacy.imagesUrls} />
            </SuspenseWrapper>
          </div>
          {/* Advertiser Info - Takes 1/3 of the width, MapSection below it */}
          <div className="flex flex-col gap-6">
            <SuspenseWrapper>
              <AdvertiserInfo owner={pharmacy.owner} pharmacyId={pharmacy.id} />
            </SuspenseWrapper>
            <SuspenseWrapper>
              <MapSection
                location={pharmacy.location}
                address={pharmacy.addressLine1}
              />
            </SuspenseWrapper>
          </div>
        </div>
        {/* Full Width Components Below */}
        <div className="space-y-8">
          {/* PharmacyDetailsTable - now full width */}
          <div>
            <SuspenseWrapper>
              <PharmacyDetailsTable pharmacy={pharmacy} />
              {/* Download Button - if needed, now inside Pharmacy Details section */}
              {pharmacy.saleFileUrl && (
                <div className="mt-6 flex justify-end">
                  <a
                    href={pharmacy.saleFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-primary dark:hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
                  >
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
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download Details
                  </a>
                </div>
              )}
            </SuspenseWrapper>
          </div>
          {/* Related Listings */}
          <SuspenseWrapper>
            <RelatedListings pharmacy={pharmacy} />
          </SuspenseWrapper>
        </div>
      </div>
    </div>
  );
}
