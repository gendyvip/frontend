import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Accordion from "@/components/ui/Accordion";
import {
  FaClinicMedical,
  FaMapMarkerAlt,
  FaPhone,
  FaIdCard,
  FaEdit,
  FaTrash,
  FaTag,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaChartBar,
  FaCapsules,
} from "react-icons/fa";
import { RiCapsuleLine } from "react-icons/ri";
import { useAuth } from "../../store/useAuth";
import { usePharmacies } from "../../store/usePharmcies";
import ConfirmDialog from "./ConfirmDialog";
import { Link } from "react-router-dom";
import ListPharmacyForSaleModal from "./ListPharmacyForSaleModal";
import { toast } from "sonner";
import {
  listPharmaciesForSale,
  unlistPharmacyFromSale,
  unlistPharmacyFromSaleJson,
} from "../../api/pharmacies";
import { LoadingPage } from "../../components/ui/loading";

export default function PharmaciesCard({ pharmacistDetails }) {
  // Add null check and default values
  const details = pharmacistDetails || {};
  const { token, user } = useAuth();
  const {
    pharmacies,
    isLoading,
    error,
    fetchPharmacies,
    deletePharmacyById,
    clearError,
  } = usePharmacies();

  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pharmacyToDelete, setPharmacyToDelete] = useState(null);
  // List for Sale modal state
  const [showListModal, setShowListModal] = useState(false);
  const [pharmacyToList, setPharmacyToList] = useState(null);
  // Local loading state for actions
  const [actionLoading, setActionLoading] = useState(false);

  // Add this handler for modal open/close
  const handleOpenChange = (open) => {
    if (!open) {
      setShowDeleteModal(false);
      setPharmacyToDelete(null);
    }
  };

  // Fetch pharmacies on component mount
  useEffect(() => {
    if (user && token) {
      fetchPharmacies(token, user);
    }
  }, [user, token, fetchPharmacies]);

  // Handle retry for failed API calls
  const handleRetry = () => {
    clearError();
    if (user && token) {
      fetchPharmacies(token, user);
    }
  };

  const handleDeleteClick = (pharmacyId) => {
    setPharmacyToDelete(pharmacyId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (pharmacyToDelete) {
      setActionLoading(true);
      setShowDeleteModal(false);
      setPharmacyToDelete(null);

      try {
        await deletePharmacyById(pharmacyToDelete, token);
        toast.success("Pharmacy deleted successfully!");
      } catch (error) {
        console.error("Failed to delete pharmacy:", error);
        toast.error(error.message || "Failed to delete pharmacy");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPharmacyToDelete(null);
  };

  const handleListClick = (pharmacyId) => {
    setPharmacyToList(pharmacyId);
    setShowListModal(true);
  };

  const handleListSubmit = async (formData) => {
    setActionLoading(true);
    try {
      // Extract data from FormData
      const saleData = {
        pharmacyPrice: formData.get("pharmacyPrice"),
        monthlySales: formData.get("monthlySales"),
        saleType: formData.get("saleType"),
        medicinesList: formData.get("medicinesList") || null,
      };

      // Call the API to list pharmacy for sale
      await listPharmaciesForSale(pharmacyToList, saleData);

      setShowListModal(false);
      setPharmacyToList(null);
      toast.success("Pharmacy listed for sale successfully!");

      // Refresh the pharmacies list to show updated status
      if (user && token) {
        await fetchPharmacies(token, user);
      }
    } catch (error) {
      console.error("Failed to list pharmacy:", error);
      toast.error(error.message || "Failed to list pharmacy for sale");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnlistClick = async (pharmacyId) => {
    setActionLoading(true);
    try {
      await unlistPharmacyFromSaleJson(pharmacyId);
      toast.success("Pharmacy unlisted from sale successfully!");
      if (user && token) {
        await fetchPharmacies(token, user);
      }
    } catch (error) {
      toast.error(error.message || "Failed to unlist pharmacy from sale");
    } finally {
      setActionLoading(false);
    }
  };

  // Validate pharmacy data structure
  const validatePharmacyData = (pharmacy) => {
    // Helper function to safely extract string values from complex objects
    const extractStringValue = (value, fallback = "Not available") => {
      if (!value) return fallback;
      if (typeof value === "string") return value;
      if (typeof value === "object") {
        // Handle GeoJSON objects
        if (value.type && value.coordinates) {
          return "Location coordinates available";
        }
        // Handle address objects
        if (value.street || value.address) {
          return value.street || value.address || fallback;
        }
        // Handle location objects
        if (value.city || value.location) {
          return value.city || value.location || fallback;
        }
        // Try to find any string property
        for (const key in value) {
          if (typeof value[key] === "string" && value[key].trim()) {
            return value[key];
          }
        }
        return fallback;
      }
      return String(value) || fallback;
    };

    // Helper function to format address
    const formatAddress = (pharmacy) => {
      const addressParts = [];
      if (pharmacy.addressLine1) addressParts.push(pharmacy.addressLine1);
      if (pharmacy.addressLine2) addressParts.push(pharmacy.addressLine2);
      if (pharmacy.city) addressParts.push(pharmacy.city);
      if (pharmacy.governorate) addressParts.push(pharmacy.governorate);
      if (pharmacy.zipCode) addressParts.push(pharmacy.zipCode);

      return addressParts.length > 0
        ? addressParts.join(", ")
        : "Address not available";
    };

    // Helper function to format working hours
    const formatWorkingHours = (pharmacy) => {
      if (pharmacy.startHour && pharmacy.endHour) {
        return `${pharmacy.startHour} - ${pharmacy.endHour}`;
      }
      return "Hours not specified";
    };

    // Helper function to get sale status
    const getSaleStatus = (pharmacy) => {
      if (pharmacy.isSold) return "Sold";
      if (pharmacy.isForSale) return "For Sale";
      return "Not for Sale";
    };

    return {
      id: pharmacy?.id || pharmacy?._id || "N/A",
      name: extractStringValue(pharmacy?.name, "Unnamed Pharmacy"),
      licenseNumber: extractStringValue(
        pharmacy?.licenseNum || pharmacy?.licenseNumber
      ),
      phone: extractStringValue(
        pharmacy?.pharmacyPhone || pharmacy?.phone || pharmacy?.phoneNumber
      ),
      address: formatAddress(pharmacy),
      city: extractStringValue(pharmacy?.city, "Unknown Location"),
      governorate: extractStringValue(pharmacy?.governorate),
      zipCode: extractStringValue(pharmacy?.zipCode),
      workingHours: formatWorkingHours(pharmacy),
      saleStatus: getSaleStatus(pharmacy),
      isForSale: pharmacy?.isForSale || false,
      pharmacyPrice: pharmacy?.pharmacyPrice,
      monthlySales: pharmacy?.monthlySales,
      saleType: pharmacy?.saleType,
      isSold: pharmacy?.isSold || false,
      status: pharmacy?.isSold
        ? "Sold"
        : pharmacy?.isForSale
        ? "For Sale"
        : "Not for Sale",
      type: extractStringValue(
        pharmacy?.type || pharmacy?.pharmacyType,
        "Standard"
      ),
      category: extractStringValue(pharmacy?.category, "General"),
      registrationDate: pharmacy?.createdAt || pharmacy?.created_at || "N/A",
      updatedAt: pharmacy?.updatedAt || pharmacy?.updated_at || "N/A",
      imagesUrls: Array.isArray(pharmacy?.imagesUrls)
        ? pharmacy.imagesUrls
        : [],
      location: pharmacy?.location || null,
    };
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="shadow-lg rounded-xl border border-gray-200 bg-white px-4 py-8">
        <CardHeader>
          <div className="inline-flex items-center gap-3 font-bold text-xl tracking-wide">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 shadow-sm w-12 h-12">
              <FaClinicMedical size={24} className="text-primary" />
            </span>
            <div className="flex flex-col">
              <span className="text-gray-900">My Pharmacies</span>
              <p className="text-sm text-gray-600 font-normal">
                Manage your added pharmacies and their details
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <LoadingPage message="Loading pharmacies..." />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="shadow-lg rounded-xl border border-gray-200 bg-white px-4 py-8">
        <CardHeader>
          <div className="inline-flex items-center gap-3 font-bold text-xl tracking-wide">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 shadow-sm w-12 h-12">
              <FaClinicMedical size={24} className="text-primary" />
            </span>
            <div className="flex flex-col">
              <span className="text-gray-900">My Pharmacies</span>
              <p className="text-sm text-gray-600 font-normal">
                Manage your registered pharmacies and their details
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="text-red-500 mb-2">
                <FaExclamationTriangle size={32} className="mx-auto" />
              </div>
              <p className="text-red-600 mb-2 text-sm">{error}</p>
              <Button
                onClick={handleRetry}
                size="sm"
                className="bg-primary hover:bg-primary/90"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Retrying...
                  </div>
                ) : (
                  "Try Again"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Defensive: always use an array and validate data
  const safePharmacies = Array.isArray(pharmacies) ? pharmacies : [];
  const validatedPharmacies = safePharmacies.map(validatePharmacyData);

  // Convert pharmacies to accordion items
  const accordionItems = validatedPharmacies.map((pharmacy, index) => ({
    title: (
      <div className="flex items-center gap-4 py-2 px-1">
        {/* SVG/Icon or Thumbnail */}
        {pharmacy.imagesUrls?.[0] ? (
          <img
            src={pharmacy.imagesUrls[0]}
            alt={pharmacy.name}
            className="w-10 h-10 object-cover rounded-full border border-gray-200 shadow-sm"
          />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 border border-primary/20 shadow-sm">
            <FaClinicMedical className="text-primary" size={22} />
          </div>
        )}

        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-semibold text-lg text-gray-900">
              {pharmacy.name}
            </span>
            <Badge
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                pharmacy.isSold
                  ? "bg-red-100 text-red-700"
                  : pharmacy.isForSale
                  ? "bg-green-100 text-green-700"
                  : "bg-red-200 text-red-700"
              }`}
            >
              {pharmacy.isSold ? (
                <FaCheckCircle />
              ) : pharmacy.isForSale ? (
                <FaTag />
              ) : (
                <FaTimesCircle />
              )}
              {pharmacy.isSold
                ? "Sold"
                : pharmacy.isForSale
                ? "For Sale"
                : "Not For Sale"}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
            <FaMapMarkerAlt className="text-gray-400" size={12} />
            <span className="truncate">
              {pharmacy.city}
              {pharmacy.governorate ? `, ${pharmacy.governorate}` : ""}
            </span>
          </div>
        </div>
      </div>
    ),
    content: (
      <Card className="mb-6 rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow p-5">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Image */}
          <div className="flex-shrink-0 flex items-center justify-center">
            {pharmacy.imagesUrls?.[0] ? (
              <img
                src={pharmacy.imagesUrls[0]}
                alt={pharmacy.name}
                className="w-20 h-20 object-cover rounded-lg border border-gray-200 bg-gray-50"
              />
            ) : (
              <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-lg border text-gray-400">
                <FaClinicMedical size={32} />
              </div>
            )}
          </div>

          {/* Main Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-lg text-gray-900 truncate">
                  {pharmacy.name}
                </span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                <FaMapMarkerAlt className="text-gray-400" />
                <span className="truncate">{pharmacy.address}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <FaPhone className="text-gray-400" />
                  <span>{pharmacy.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaIdCard className="text-gray-400" />
                  <span>{pharmacy.licenseNumber}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaClock className="text-gray-400" />
                  <span>{pharmacy.workingHours}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaClinicMedical className="text-gray-400" />
                  <span>{pharmacy.city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span>{pharmacy.governorate}</span>
                </div>
              </div>
            </div>

            {/* Sale Info */}
            {pharmacy.isForSale && (
              <div className="mt-3 flex flex-wrap gap-4 items-center text-xs">
                <div className="flex items-center gap-1 text-primary font-semibold">
                  <FaTag />
                  <span>{pharmacy.pharmacyPrice} EGP</span>
                </div>
                <div className="flex items-center gap-1 text-gray-700">
                  <FaChartBar />
                  <span>{pharmacy.monthlySales} EGP</span>
                </div>
                <div className="flex items-center gap-1 text-gray-700">
                  <FaCapsules />
                  <span>
                    {pharmacy.saleType === "pharmacy_with_medicines"
                      ? "With Medicines"
                      : pharmacy.saleType === "pharmacy_only"
                      ? "Without Medicines"
                      : pharmacy.saleType}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-4 justify-end">
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
                asChild
                disabled={actionLoading}
              >
                <Link to={`/pharmacies/${pharmacy.id}/edit`}>
                  <FaEdit size={14} />
                  Edit
                </Link>
              </Button>
              {pharmacy.isForSale && !pharmacy.isSold ? (
                <Button
                  size="sm"
                  className="flex items-center gap-2 bg-zinc-700 text-white hover:bg-zinc-600 border-primary"
                  onClick={() => handleUnlistClick(pharmacy.id)}
                  disabled={actionLoading}
                >
                  <FaTag size={14} />
                  Unlist Sale
                </Button>
              ) : (
                !pharmacy.isSold && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex bg-green-600 hover:bg-green-500 text-white items-center gap-2"
                    onClick={() => handleListClick(pharmacy.id)}
                    disabled={actionLoading}
                  >
                    <FaTag size={14} />
                    List for Sale
                  </Button>
                )
              )}
              <Button
                size="sm"
                variant="destructive"
                className="flex items-center gap-2"
                onClick={() => handleDeleteClick(pharmacy.id)}
                disabled={actionLoading}
              >
                <FaTrash size={14} />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Card>
    ),
  }));

  return (
    <div className="space-y-6">
      <Card className="shadow-lg rounded-xl border border-gray-200 bg-white px-4 py-8">
        <CardHeader>
          <div className="inline-flex items-center gap-3 font-bold text-xl tracking-wide">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 shadow-sm w-12 h-12">
              <FaClinicMedical size={24} className="text-primary" />
            </span>
            <div className="flex flex-col">
              <span className="text-gray-900">My Pharmacies</span>
              <p className="text-sm text-gray-600 font-normal">
                Manage your added pharmacies and their details
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {validatedPharmacies.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <FaClinicMedical size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Pharmacies Found
              </h3>
              <p className="text-gray-600 mb-4">
                You haven't added any pharmacies yet.
              </p>
              <Button asChild>
                <Link to="/pharmacies/new">Add Your First Pharmacy</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Your Pharmacies ({validatedPharmacies.length})
                </h3>
                <Button asChild>
                  <Link to="/pharmacies/new">Add New Pharmacy</Link>
                </Button>
              </div>

              <Accordion items={accordionItems} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ConfirmDialog
        open={showDeleteModal}
        onOpenChange={handleOpenChange}
        onConfirm={handleConfirmDelete}
        title="Delete Pharmacy"
        description="Are you sure you want to delete this pharmacy? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ListPharmacyForSaleModal
        open={showListModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowListModal(false);
            setPharmacyToList(null);
          }
        }}
        onSubmit={handleListSubmit}
        initialPharmacy={
          pharmacyToList
            ? validatedPharmacies.find((p) => p.id === pharmacyToList)
            : null
        }
      />
    </div>
  );
}
