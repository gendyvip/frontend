import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar28 } from "./DatePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UploadCloud, XCircle, Search, Loader2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { usePharmacies } from "@/store/usePharmcies";
import { useAuth } from "@/store/useAuth";
import { useDeals } from "@/store/useDeals";
import { fetchDrugs } from "@/api/drugs";
import { useDebounce } from "@/hooks/useDebounce";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

let dealSchema = Yup.object().shape({
  medicineName: Yup.string().required("Medicine name is required"),
  quantity: Yup.number()
    .required("Quantity is required")
    .positive("Quantity must be positive")
    .integer("Quantity must be a whole number"),
  expiryDate: Yup.date()
    .required("Expiry date is required")
    .min(new Date(), "Expiry date must be in the future"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
  pharmacyId: Yup.string().required("Pharmacy is required"),
  boxStatus: Yup.string().required("Box status is required"),
  dealType: Yup.string().required("Deal type is required"),
  minPrice: Yup.number()
    .required("Minimum price is required")
    .positive("Minimum price must be positive")
    .min(1, "Minimum price must be at least 1"),
  medicineType: Yup.string().required("Medicine type is required"),
});

// Edit mode schema - only validates editable fields
let editDealSchema = Yup.object().shape({
  quantity: Yup.number()
    .required("Quantity is required")
    .positive("Quantity must be positive")
    .integer("Quantity must be a whole number"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters"),
  dealType: Yup.string().required("Deal type is required"),
  minPrice: Yup.number()
    .required("Minimum price is required")
    .positive("Minimum price must be positive")
    .min(1, "Minimum price must be at least 1"),
});

export function DealForm({ className, ...props }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [drugs, setDrugs] = React.useState([]);
  const [filteredDrugs, setFilteredDrugs] = React.useState([]);
  const [isLoadingDrugs, setIsLoadingDrugs] = React.useState(false);
  const [isSelectOpen, setIsSelectOpen] = React.useState(false);
  const [isLoadingDeal, setIsLoadingDeal] = React.useState(false);
  const [dealData, setDealData] = React.useState(null);
  const { pharmacies, fetchPharmacies } = usePharmacies();
  const { user, token } = useAuth();
  const { createDeal, updateDeal, fetchDeal, isSubmitting, error, clearError } =
    useDeals();
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = !!id;

  const searchDrugs = React.useCallback(
    async (searchValue) => {
      if (!token) {
        console.log("No token available for search");
        return;
      }

      try {
        console.log("Searching for:", searchValue);
        setIsLoadingDrugs(true);
        const response = await fetchDrugs(token, {
          search: searchValue,
          size: 20,
        });
        console.log("Search response:", response);
        const fetchedDrugs = response.data?.drugs || [];
        console.log("Search results:", fetchedDrugs);
        setFilteredDrugs(fetchedDrugs);
      } catch (error) {
        console.error("Error searching drugs:", error);
        setFilteredDrugs([]);
      } finally {
        setIsLoadingDrugs(false);
      }
    },
    [token]
  );

  // Debounced search function
  const debouncedSearch = useDebounce(searchDrugs, 300);

  // Load initial drugs when component mounts
  React.useEffect(() => {
    const loadInitialDrugs = async () => {
      if (!token) {
        console.log("No token available, skipping initial drug load");
        return;
      }

      try {
        console.log("Loading initial drugs...");
        setIsLoadingDrugs(true);
        const response = await fetchDrugs(token, { size: 20 });
        console.log("Initial drugs response:", response);
        const fetchedDrugs = response.data?.drugs || [];
        console.log("Fetched drugs:", fetchedDrugs);
        setDrugs(fetchedDrugs);
        setFilteredDrugs(fetchedDrugs);
      } catch (error) {
        console.error("Error loading initial drugs:", error);
        setDrugs([]);
        setFilteredDrugs([]);
      } finally {
        setIsLoadingDrugs(false);
      }
    };

    loadInitialDrugs();
  }, [token]);

  // Handle search term changes
  React.useEffect(() => {
    if (searchTerm.trim()) {
      debouncedSearch(searchTerm);
    } else {
      // When search is cleared, show all drugs
      setFilteredDrugs(drugs);
    }
  }, [searchTerm, drugs, debouncedSearch]);

  React.useEffect(() => {
    if (token && user) {
      // Extract user ID from user object
      const userId = user?.id || user;
      if (userId) {
        fetchPharmacies(token, userId);
      }
    }
  }, [token, user, fetchPharmacies]);

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      // Clear any previous errors
      clearError();

      if (isEditMode) {
        // Update existing deal - only send editable fields
        const updateData = {
          quantity: parseInt(values.quantity),
          price: parseFloat(values.minPrice),
          description: values.description,
          dealType: values.dealType,
        };

        console.log("Updating deal data:", updateData);
        await updateDeal(id, updateData);

        toast.success("Deal has been successfully updated!", {
          description: "Your medicine deal has been updated.",
          duration: 5000,
          position: "top-center",
          style: {
            background: "#10b981",
            color: "white",
            border: "1px solid #059669",
          },
          className: "text-white",
          descriptionClassName: "text-white/90 font-medium",
        });

        // Navigate back to deals page
        navigate("/deals");
      } else {
        // Create new deal
        const dealData = {
          medicineName: values.medicineName,
          quantity: parseInt(values.quantity),
          expiryDate: values.expiryDate,
          price: parseFloat(values.minPrice),
          description: values.description,
          pharmacyId: values.pharmacyId,
          boxStatus: values.boxStatus,
          dealType: values.dealType,
          dosageForm: values.medicineType,
        };

        console.log("Submitting deal data:", dealData);
        await createDeal(dealData);

        toast.success("Deal has been successfully posted!", {
          description:
            "Your medicine deal has been posted and is now visible to other users.",
          duration: 5000,
          position: "top-center",
          style: {
            background: "#10b981",
            color: "white",
            border: "1px solid #059669",
          },
          className: "text-white",
          descriptionClassName: "text-white/90 font-medium",
        });

        // Reset form
        formik.resetForm();
      }
    } catch (error) {
      console.error("Error handling deal:", error);

      toast.error(
        isEditMode ? "Failed to update deal" : "Failed to post deal",
        {
          description:
            error.message || "Something went wrong. Please try again.",
          duration: 5000,
          position: "top-center",
          style: {
            background: "#ef4444",
            color: "white",
            border: "1px solid #dc2626",
          },
          className: "text-white",
          descriptionClassName: "text-white/90 font-medium",
        }
      );

      throw error;
    }
  };

  const formik = useFormik({
    initialValues: {
      medicineName: dealData?.medicineName || "",
      quantity: dealData?.quantity || "",
      expiryDate: dealData?.expiryDate ? new Date(dealData.expiryDate) : null,
      marketPrice: dealData?.marketPrice || "",
      minPrice: dealData?.price || "",
      medicineType: dealData?.dosageForm || "",
      description: dealData?.description || "",
      pharmacyId: dealData?.pharmacyId || "",
      boxStatus: dealData?.boxStatus || "",
      dealType: dealData?.dealType || "",
    },
    validationSchema: isEditMode ? editDealSchema : dealSchema,
    onSubmit: handleSubmit,
    validateOnMount: true,
    enableReinitialize: true,
  });

  // Load deal data for edit mode
  useEffect(() => {
    const loadDealData = async () => {
      if (!isEditMode || !id || !token) return;

      try {
        setIsLoadingDeal(true);
        const response = await fetchDeal(id);
        const loadedDealData = response.data?.deal || response.data || response;

        console.log("Loaded deal data:", loadedDealData);
        setDealData(loadedDealData);
      } catch (error) {
        console.error("Error loading deal data:", error);
        toast.error("Failed to load deal data");
      } finally {
        setIsLoadingDeal(false);
      }
    };

    loadDealData();
  }, [id, token, isEditMode]);

  // Show loading state while fetching deal data
  if (isEditMode && isLoadingDeal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deal data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-100 rounded-full -ml-20 -mb-20 opacity-50"></div>

        <div className="relative p-8">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-2xl font-bold text-foreground">
              {isEditMode ? "Edit Deal" : "Post Your Deal"}
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              {isEditMode
                ? "Update your deal details below"
                : "Fill out the form below to post your medicine deal"}
            </p>
          </CardHeader>

          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
            onSubmit={formik.handleSubmit}
          >
            {/* Medicine Selection - Read-only in edit mode */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label
                htmlFor="medicineName"
                className="text-gray-700 font-medium"
              >
                Medicine Name <span className="text-red-500">*</span>
              </Label>
              {isEditMode ? (
                <Input
                  value={formik.values.medicineName}
                  disabled
                  className="border-gray-300 rounded-lg h-11 bg-gray-100 text-gray-600"
                />
              ) : (
                <Select
                  value={formik.values.medicineName}
                  onValueChange={(value) => {
                    formik.setFieldValue("medicineName", value);
                    setIsSelectOpen(false);
                  }}
                  onOpenChange={setIsSelectOpen}
                >
                  <SelectTrigger className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm w-full ">
                    <SelectValue placeholder="Select medicine" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 w-[400px]">
                    <div className="p-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search for medicine..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 border-gray-300 rounded-lg h-9 focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {isLoadingDrugs ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span className="text-sm text-gray-500">
                            {searchTerm.trim()
                              ? "Searching..."
                              : "Loading drugs..."}
                          </span>
                        </div>
                      ) : filteredDrugs.length > 0 ? (
                        filteredDrugs.map((drug) => (
                          <SelectItem key={drug.id} value={drug.drugName}>
                            <div>
                              <div className="font-medium">{drug.drugName}</div>
                            </div>
                          </SelectItem>
                        ))
                      ) : searchTerm.trim() ? (
                        <div className="py-4 text-center text-sm text-gray-500">
                          No drugs found for "{searchTerm}"
                        </div>
                      ) : drugs.length === 0 ? (
                        <div className="py-4 text-center text-sm text-gray-500">
                          No drugs available
                        </div>
                      ) : (
                        <div className="py-4 text-center text-sm text-gray-500">
                          Start typing to search for drugs
                        </div>
                      )}
                    </div>
                  </SelectContent>
                </Select>
              )}
              {formik.touched.medicineName && formik.errors.medicineName && (
                <div className="text-red-500 text-xs">
                  {formik.errors.medicineName}
                </div>
              )}
            </div>

            {/* Quantity - Editable in both modes */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="quantity" className="text-gray-700 font-medium">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="Enter quantity"
                className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.quantity && formik.errors.quantity && (
                <div className="text-red-500 text-xs">
                  {formik.errors.quantity}
                </div>
              )}
            </div>

            {/* Medicine Type - Read-only in edit mode */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label
                htmlFor="medicineType"
                className="text-gray-700 font-medium"
              >
                Medicine Type <span className="text-red-500">*</span>
              </Label>
              {isEditMode ? (
                <Input
                  value={formik.values.medicineType}
                  disabled
                  className="border-gray-300 rounded-lg h-11 bg-gray-100 text-gray-600"
                />
              ) : (
                <Select
                  value={formik.values.medicineType}
                  onValueChange={(value) =>
                    formik.setFieldValue("medicineType", value)
                  }
                >
                  <SelectTrigger className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm w-full">
                    <SelectValue placeholder="Select medicine type" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 w-[400px]">
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="capsule">Capsule</SelectItem>
                    <SelectItem value="syrup">Syrup</SelectItem>
                    <SelectItem value="injection">Injection</SelectItem>
                    <SelectItem value="ointment">Ointment</SelectItem>
                    <SelectItem value="cream">Cream</SelectItem>
                    <SelectItem value="gel">Gel</SelectItem>
                    <SelectItem value="spray">Spray</SelectItem>
                    <SelectItem value="drops">Drops</SelectItem>
                    <SelectItem value="suppository">Suppository</SelectItem>
                    <SelectItem value="powder">Powder</SelectItem>
                    <SelectItem value="inhaler">Inhaler</SelectItem>
                    <SelectItem value="patch">Patch</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {formik.touched.medicineType && formik.errors.medicineType && (
                <div className="text-red-500 text-xs">
                  {formik.errors.medicineType}
                </div>
              )}
            </div>

            {/* Expiry Date - Read-only in edit mode */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label className="text-gray-700 font-medium">
                Expiry Date <span className="text-red-500">*</span>
              </Label>
              {isEditMode ? (
                <Input
                  value={
                    formik.values.expiryDate
                      ? new Date(formik.values.expiryDate).toLocaleDateString()
                      : ""
                  }
                  disabled
                  className="border-gray-300 rounded-lg h-11 bg-gray-100 text-gray-600"
                />
              ) : (
                <div className="bg-white/80 rounded-lg border border-gray-300">
                  <Calendar28
                    value={formik.values.expiryDate}
                    onChange={(date) =>
                      formik.setFieldValue("expiryDate", date)
                    }
                  />
                </div>
              )}
              {formik.touched.expiryDate && formik.errors.expiryDate && (
                <div className="text-red-500 text-xs">
                  {formik.errors.expiryDate}
                </div>
              )}
            </div>

            {/* Market Price - Read-only in both modes */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label
                htmlFor="marketPrice"
                className="text-gray-700 font-medium"
              >
                Market Price (EGP){" "}
                <span className="text-gray-400 text-xs">(Info only)</span>
              </Label>
              <Input
                id="marketPrice"
                name="marketPrice"
                type="text"
                disabled
                placeholder="0.00"
                className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm"
                value={formik.values.marketPrice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {/* Minimum Price - Editable in both modes */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="minPrice" className="text-gray-700 font-medium">
                Minimum Price (EGP) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="minPrice"
                name="minPrice"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Enter minimum price"
                className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm"
                value={formik.values.minPrice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.minPrice && formik.errors.minPrice && (
                <div className="text-red-500 text-xs">
                  {formik.errors.minPrice}
                </div>
              )}
            </div>

            {/* Description - Editable in both modes */}
            <div className="space-y-2 col-span-2">
              <Label
                htmlFor="description"
                className="text-gray-700 font-medium"
              >
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your medicine, condition, reason for selling/exchanging..."
                className="border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={4}
              />
              <p className="text-xs text-gray-500">
                {formik.values.description?.length || 0}/500 characters
              </p>
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-500 text-xs">
                  {formik.errors.description}
                </div>
              )}
            </div>

            {/* Pharmacy Select - Read-only in edit mode */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="pharmacyId" className="text-gray-700 font-medium">
                Pharmacy <span className="text-red-500">*</span>
              </Label>
              {isEditMode ? (
                <Input
                  value={
                    pharmacies.find((p) => p.id === formik.values.pharmacyId)
                      ?.name || ""
                  }
                  disabled
                  className="border-gray-300 rounded-lg h-11 bg-gray-100 text-gray-600"
                />
              ) : (
                <Select
                  value={formik.values.pharmacyId}
                  onValueChange={(value) =>
                    formik.setFieldValue("pharmacyId", value)
                  }
                >
                  <SelectTrigger className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm w-full ">
                    <SelectValue
                      placeholder={
                        pharmacies && pharmacies.length > 0
                          ? "Select pharmacy"
                          : "No pharmacies found"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 w-[400px]">
                    {pharmacies &&
                      pharmacies.length > 0 &&
                      pharmacies.map((pharmacy) => (
                        <SelectItem key={pharmacy.id} value={pharmacy.id}>
                          {pharmacy.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
              {formik.touched.pharmacyId && formik.errors.pharmacyId && (
                <div className="text-red-500 text-xs">
                  {formik.errors.pharmacyId}
                </div>
              )}
            </div>

            {/* Box Status Select - Read-only in edit mode */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <Label htmlFor="boxStatus" className="text-gray-700 font-medium">
                Medicine Box Status <span className="text-red-500">*</span>
              </Label>
              {isEditMode ? (
                <Input
                  value={formik.values.boxStatus}
                  disabled
                  className="border-gray-300 rounded-lg h-11 bg-gray-100 text-gray-600"
                />
              ) : (
                <Select
                  value={formik.values.boxStatus}
                  onValueChange={(value) =>
                    formik.setFieldValue("boxStatus", value)
                  }
                >
                  <SelectTrigger className="border-gray-300 rounded-lg h-11 focus:border-primary focus:ring-1 focus:ring-primary bg-white/80 backdrop-blur-sm w-full ">
                    <SelectValue placeholder="Select box status" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 w-[400px]">
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {formik.touched.boxStatus && formik.errors.boxStatus && (
                <div className="text-red-500 text-xs">
                  {formik.errors.boxStatus}
                </div>
              )}
            </div>

            {/* Deal Type - Editable in both modes */}
            <div className="space-y-2 col-span-2">
              <Label className="text-gray-700 font-medium">
                Deal Type <span className="text-red-500">*</span>
              </Label>
              <div className="p-3">
                <RadioGroup
                  name="dealType"
                  value={formik.values.dealType}
                  onValueChange={(value) =>
                    formik.setFieldValue("dealType", value)
                  }
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sell" id="deal-sell" />
                    <Label htmlFor="deal-sell">Sell</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="exchange" id="deal-exchange" />
                    <Label htmlFor="deal-exchange">Exchange</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="deal-both" />
                    <Label htmlFor="deal-both">Both</Label>
                  </div>
                </RadioGroup>
              </div>
              {formik.touched.dealType && formik.errors.dealType && (
                <div className="text-red-500 text-xs">
                  {formik.errors.dealType}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="col-span-2 pt-3">
              <Button
                type="submit"
                className={`w-full bg-primary hover:bg-primary-hover cursor-pointer text-white py-5 mb-10 text-base font-medium rounded-lg ${
                  !formik.isValid || isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={!formik.isValid || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isEditMode ? "Updating Deal..." : "Posting Deal..."}
                  </>
                ) : isEditMode ? (
                  "Update Deal"
                ) : (
                  "Post Deal"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
