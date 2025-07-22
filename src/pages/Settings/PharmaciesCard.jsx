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
  markPharmacyAsSold,
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
  // Mark as Sold modal state
  const [showMarkAsSoldModal, setShowMarkAsSoldModal] = useState(false);
  const [pharmacyToMarkAsSold, setPharmacyToMarkAsSold] = useState(null);
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
      // Extract user ID from user object
      const userId = user?.id || user;

      if (userId) {
        fetchPharmacies(token, userId);
      }
    }
  }, [user, token, fetchPharmacies]);

  // Handle retry for failed API calls
  const handleRetry = () => {
    clearError();
    if (user && token) {
      // Extract user ID from user object
      const userId = user?.id || user;
      if (userId) {
        fetchPharmacies(token, userId);
      }
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
        const userId = user?.id || user;
        if (userId) {
          await fetchPharmacies(token, userId);
        }
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
        const userId = user?.id || user;
        if (userId) {
          await fetchPharmacies(token, userId);
        }
      }
    } catch (error) {
      toast.error(error.message || "Failed to unlist pharmacy from sale");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsSoldClick = (pharmacyId) => {
    setPharmacyToMarkAsSold(pharmacyId);
    setShowMarkAsSoldModal(true);
  };

  const handleConfirmMarkAsSold = async () => {
    if (pharmacyToMarkAsSold) {
      setActionLoading(true);
      setShowMarkAsSoldModal(false);
      setPharmacyToMarkAsSold(null);

      try {
        await markPharmacyAsSold(pharmacyToMarkAsSold);
        toast.success("Pharmacy marked as sold successfully!");

        // Refresh the pharmacies list to show updated status
        if (user && token) {
          const userId = user?.id || user;
          if (userId) {
            await fetchPharmacies(token, userId);
          }
        }
      } catch (error) {
        console.error("Failed to mark pharmacy as sold:", error);
        toast.error(error.message || "Failed to mark pharmacy as sold");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleCancelMarkAsSold = () => {
    setShowMarkAsSoldModal(false);
    setPharmacyToMarkAsSold(null);
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
      <Card className="shadow-lg rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-background px-4 py-8">
        <CardHeader>
          <div className="inline-flex items-center gap-3 font-bold text-xl tracking-wide">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 shadow-sm w-12 h-12">
              <FaClinicMedical size={24} className="text-primary" />
            </span>
            <div className="flex flex-col">
              <span className="text-gray-900 dark:text-foreground">
                My Pharmacies
              </span>
              <p className="text-sm text-gray-600 font-normal dark:text-gray-400">
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
      <Card className="shadow-lg rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-background px-4 py-8">
        <CardHeader>
          <div className="inline-flex items-center gap-3 font-bold text-xl tracking-wide">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 shadow-sm w-12 h-12">
              <FaClinicMedical size={24} className="text-primary" />
            </span>
            <div className="flex flex-col">
              <span className="text-gray-900 dark:text-foreground">
                My Pharmacies
              </span>
              <p className="text-sm text-gray-600 font-normal dark:text-gray-400">
                Manage your registered pharmacies and their details
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="text-red-500 mb-2 dark:text-red-400">
                <FaExclamationTriangle size={32} className="mx-auto" />
              </div>
              <p className="text-red-600 mb-2 text-sm dark:text-red-400">
                {error}
              </p>
              <Button
                onClick={handleRetry}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white"
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
            <span className="truncate font-semibold text-lg text-gray-900 dark:text-foreground">
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
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-300 mt-0.5">
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
      <Card className="mb-6 rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-background shadow-md hover:shadow-lg dark:hover:shadow-xl transition-shadow p-5">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Image */}
          <div className="flex-shrink-0 flex items-center justify-center">
            {pharmacy.imagesUrls?.[0] ? (
              <img
                src={pharmacy.imagesUrls[0]}
                alt={pharmacy.name}
                className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-border bg-gray-50 dark:bg-zinc-800"
              />
            ) : (
              <div className="w-20 h-20 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-border text-gray-400 dark:text-gray-500">
                <FaClinicMedical size={32} />
              </div>
            )}
          </div>

          {/* Main Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-lg text-gray-900 dark:text-foreground truncate">
                  {pharmacy.name}
                </span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                <FaMapMarkerAlt className="text-gray-400 dark:text-gray-500" />
                <span className="truncate dark:text-gray-400">
                  {pharmacy.address}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <FaPhone className="text-gray-400 dark:text-gray-500" />
                  <span>{pharmacy.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaIdCard className="text-gray-400 dark:text-gray-500" />
                  <span>{pharmacy.licenseNumber}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaClock className="text-gray-400 dark:text-gray-500" />
                  <span>{pharmacy.workingHours}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaClinicMedical className="text-gray-400 dark:text-gray-500" />
                  <span>{pharmacy.city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-gray-400 dark:text-gray-500" />
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
                className="flex items-center gap-2 border-gray-200 dark:border-border bg-white dark:bg-background text-primary dark:text-primary"
                asChild
                disabled={actionLoading}
              >
                <Link to={`/pharmacies/${pharmacy.id}/edit`}>
                  <FaEdit size={14} />
                  Edit
                </Link>
              </Button>
              {pharmacy.isForSale && !pharmacy.isSold ? (
                <>
                  <Button
                    size="sm"
                    className="flex items-center gap-2 bg-zinc-700 text-white hover:bg-zinc-600 border-primary dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white"
                    onClick={() => handleUnlistClick(pharmacy.id)}
                    disabled={actionLoading}
                  >
                    <FaTag size={14} />
                    Unlist Sale
                  </Button>
                  <Button
                    size="sm"
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white dark:bg-orange-700 dark:hover:bg-orange-600 dark:text-white"
                    onClick={() => handleMarkAsSoldClick(pharmacy.id)}
                    disabled={actionLoading}
                  >
                    <FaCheckCircle size={14} />
                    Mark as Sold
                  </Button>
                </>
              ) : (
                !pharmacy.isSold && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex bg-green-600 hover:bg-green-500 text-white dark:bg-green-700 dark:hover:bg-green-600 dark:text-white items-center gap-2"
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
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800 dark:text-white"
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
      <Card className="shadow-lg rounded-xl border border-gray-200 dark:border-border bg-white dark:bg-background px-4 py-8">
        <CardHeader>
          <div className="inline-flex items-center gap-3 font-bold text-xl tracking-wide">
            <span className="inline-flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 shadow-sm w-12 h-12">
              <FaClinicMedical size={24} className="text-primary" />
            </span>
            <div className="flex flex-col">
              <span className="text-gray-900 dark:text-foreground">
                My Pharmacies
              </span>
              <p className="text-sm text-gray-600 font-normal dark:text-gray-300">
                Manage your added pharmacies and their details
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {validatedPharmacies.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <FaClinicMedical size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-2">
                No Pharmacies Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You haven't added any pharmacies yet.
              </p>
              <Button asChild>
                <Link to="/pharmacies/new">Add Your First Pharmacy</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">
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

      <ConfirmDialog
        open={showMarkAsSoldModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowMarkAsSoldModal(false);
            setPharmacyToMarkAsSold(null);
          }
        }}
        onConfirm={handleConfirmMarkAsSold}
        title="Mark Pharmacy as Sold"
        description="Are you sure you want to mark this pharmacy as sold? This action will remove the pharmacy from sale listings and cannot be undone."
        confirmText="Mark as Sold"
        cancelText="Cancel"
      />
    </div>
  );
}
