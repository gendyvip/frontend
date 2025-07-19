import { useEffect, useState, useCallback, useMemo } from "react";
import { getPharmaciesForSale } from "../../api/pharmacies";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Label } from "../../components/ui/label";
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  MapPinOff,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import { Card } from "../../components/ui/card";
import PharmaciesList from "./PharmaciesList";
import { useAuth } from "../../store/useAuth";
import CornerAd from "@/components/ui/CornerAd";

export default function PharmaciesForSale() {
  // Filter state (all in one place, like deals)
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [saleType, setSaleType] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [userLocation, setUserLocation] = useState({ lat: null, long: null });
  const [useLocationSort, setUseLocationSort] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const token = useAuth((state) => state.token);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Debounce search input
  const setSearchCallback = useCallback((value) => {
    setSearch(value);
  }, []);
  const debouncedSetSearch = useDebounce(setSearchCallback, 500);
  const handleSearchInput = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchInput(value);
      debouncedSetSearch(value);
    },
    [debouncedSetSearch]
  );

  // Build query params for backend
  const buildQueryParams = useCallback(() => {
    const params = {
      page: currentPage,
    };
    if (search) params.search = search;
    if (governorate) params.governorate = governorate;
    if (saleType) params.saleType = saleType;
    if (priceRange.min) params.minPrice = priceRange.min;
    if (priceRange.max) params.maxPrice = priceRange.max;
    if (sortBy) params.sort = sortOrder === "desc" ? `-${sortBy}` : sortBy;
    if (useLocationSort && userLocation.lat && userLocation.long) {
      params.lat = userLocation.lat;
      params.long = userLocation.long;
    } else {
      delete params.lat;
      delete params.long;
    }
    return params;
  }, [
    search,
    governorate,
    saleType,
    priceRange,
    sortBy,
    sortOrder,
    currentPage,
    useLocationSort,
    userLocation.lat,
    userLocation.long,
  ]);

  // Active filter chips
  const getActiveFilters = useMemo(() => {
    const filters = [];
    if (search)
      filters.push({
        key: "search",
        label: `"${search}"`,
        onRemove: () => {
          setSearch("");
          setSearchInput("");
        },
      });
    if (governorate)
      filters.push({
        key: "governorate",
        label: governorate,
        onRemove: () => setGovernorate(""),
      });
    if (saleType)
      filters.push({
        key: "saleType",
        label:
          saleType === "pharmacy_with_medicines"
            ? "With Medicines"
            : "Pharmacy Only",
        onRemove: () => setSaleType(""),
      });
    if (priceRange.min)
      filters.push({
        key: "minPrice",
        label: `Min: EGP ${priceRange.min}`,
        onRemove: () => setPriceRange((prev) => ({ ...prev, min: "" })),
      });
    if (priceRange.max)
      filters.push({
        key: "maxPrice",
        label: `Max: EGP ${priceRange.max}`,
        onRemove: () => setPriceRange((prev) => ({ ...prev, max: "" })),
      });
    if (useLocationSort)
      filters.push({
        key: "useLocationSort",
        label: "Nearest Pharmacy",
        onRemove: () => setUseLocationSort(false),
      });
    return filters;
  }, [search, governorate, saleType, priceRange, useLocationSort]);
  const activeFilters = getActiveFilters;

  // Add sort options
  const sortOptions = [
    // { value: "price-asc", label: "Price (Low to High)" },
    // { value: "price-desc", label: "Price (High to Low)" },
    { value: "createdAt-asc", label: "Created Date (Oldest First)" },
    { value: "createdAt-desc", label: "Created Date (Newest First)" },
    { value: "name-asc", label: "Name (A to Z)" },
    { value: "name-desc", label: "Name (Z to A)" },
  ];

  // Fetch pharmacies based on current filters and pagination
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const params = buildQueryParams();
        const res = await getPharmaciesForSale(params, token);
        setPharmacies(res.data.pharmacies || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        setError(err.message || "Failed to load pharmacies");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, [
    buildQueryParams,
    currentPage,
    token,
    useLocationSort,
    userLocation.lat,
    userLocation.long,
    sortBy,
    sortOrder,
  ]);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearch("");
    setSearchInput("");
    setGovernorate("");
    setSaleType("");
    setPriceRange({ min: "", max: "" });
    setSortBy("");
    setSortOrder("asc");
    setCurrentPage(1);
    setUseLocationSort(false);
    setUserLocation({ lat: null, long: null });
    setLocationError("");
  }, []);

  const handleViewDetails = (pharmacy) => {
    navigate(`/pharmacies/${pharmacy.id}`);
  };

  // Only show pharmacies not owned by the current user
  const filteredPharmacies = pharmacies.filter(
    (pharmacy) => !(pharmacy.owner && pharmacy.owner.id === user)
  );

  // Pagination page numbers (with ellipsis) - copied from deals page
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const total = totalPages || 1;
    if (total <= maxVisiblePages) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(total);
      } else if (currentPage >= total - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = total - 3; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(total);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-background">
      <CornerAd position="allPharmcies" />

      <section className="py-5 px-4 text-foreground">
        <div className="max-w-7xl mx-auto flex items-center justify-between mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold ">
            Pharmacies for Sale
          </h1>
        </div>
      </section>
      <section className="px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filters Card - Unified, like deals */}
          <Card className="p-6 mb-8">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-2 w-full sm:w-auto">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Filters
                  </h3>
                  <p className="text-sm text-gray-500">
                    Refine your search results
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start">
                  <Button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Advanced
                    {activeFilters.length > 0 && (
                      <Badge className="bg-zinc-600 text-white ml-1">
                        {activeFilters.length}
                      </Badge>
                    )}
                    {showAdvancedFilters ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear All
                  </Button>
                  <Button
                    type="button"
                    variant={useLocationSort ? "default" : "outline"}
                    size="sm"
                    className={`flex items-center gap-2 ${
                      useLocationSort
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-primary border-primary/30 hover:bg-primary/10"
                    }`}
                    title={
                      useLocationSort
                        ? "Sorted by nearest"
                        : "Sort by nearest pharmacy"
                    }
                    onClick={() => {
                      if (!useLocationSort) {
                        if ("geolocation" in navigator) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              setUserLocation({
                                lat: position.coords.latitude,
                                long: position.coords.longitude,
                              });
                              setUseLocationSort(true);
                              setLocationError("");
                            },
                            (error) => {
                              setLocationError(
                                "Location access denied or unavailable."
                              );
                              setUseLocationSort(false);
                            }
                          );
                        } else {
                          setLocationError(
                            "Geolocation is not supported by your browser."
                          );
                        }
                      } else {
                        setUseLocationSort(false);
                        setUserLocation({ lat: null, long: null });
                        setLocationError("");
                      }
                    }}
                  >
                    {useLocationSort ? (
                      <MapPin className="w-4 h-4" />
                    ) : (
                      <MapPinOff className="w-4 h-4" />
                    )}
                    {useLocationSort ? "Nearest" : "Sort by Nearest"}
                  </Button>
                </div>
              </div>
              {/* Location error message */}
              {locationError && (
                <div className="text-red-500 text-sm mb-2">{locationError}</div>
              )}
              {/* Basic Filters */}
              <div>
                <div className="flex flex-col gap-3 md:flex-row md:gap-4">
                  <div className="flex-1 min-w-[180px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by name or location"
                        value={searchInput}
                        onChange={handleSearchInput}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-44">
                    <Select value={governorate} onValueChange={setGovernorate}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Governorate" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Cairo",
                          "Giza",
                          "Alexandria",
                          "Dakahlia",
                          "Red Sea",
                          "Beheira",
                          "Fayoum",
                          "Gharbiya",
                          "Ismailia",
                          "Menofia",
                          "Minya",
                          "Qaliubiya",
                          "New Valley",
                          "Suez",
                          "Aswan",
                          "Assiut",
                          "Beni Suef",
                          "Port Said",
                          "Damietta",
                          "Sharkia",
                          "South Sinai",
                          "Kafr El Sheikh",
                          "Matrouh",
                          "Luxor",
                          "Qena",
                          "North Sinai",
                          "Sohag",
                        ].map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full md:w-44">
                    <Select value={saleType} onValueChange={setSaleType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pharmacy_only">
                          Pharmacy Only
                        </SelectItem>
                        <SelectItem value="pharmacy_with_medicines">
                          Pharmacy with Medicines
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full md:w-44">
                    <Select
                      value={sortBy ? `${sortBy}-${sortOrder}` : ""}
                      onValueChange={(value) => {
                        if (!value) {
                          setSortBy("");
                          setSortOrder("asc");
                        } else {
                          const [newSortBy, newSortOrder] = value.split("-");
                          setSortBy(newSortBy);
                          setSortOrder(newSortOrder);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              {/* Active Filter Chips */}
              {activeFilters.length > 0 && (
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Active Filters:
                    </span>
                    <Badge className="bg-zinc-600 text-white text-xs">
                      {activeFilters.length}
                    </Badge>
                  </div>
                  <div className="flex flex-nowrap gap-2 overflow-x-auto max-w-full pb-1">
                    {activeFilters.map((filter) => (
                      <Badge
                        key={filter.key}
                        className="flex items-center gap-1 cursor-pointer bg-zinc-600 text-white hover:bg-zinc-600/70 transition-colors"
                        onClick={filter.onRemove}
                      >
                        {filter.label}
                        <X className="h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="border-t pt-6">
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-2">
                      Advanced Filters
                    </h4>
                    <p className="text-sm text-gray-500">
                      Set price range filters
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {/* Price Range */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">
                        Price Range (EGP)
                      </Label>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <Input
                            placeholder="Min price"
                            type="number"
                            value={priceRange.min}
                            onChange={(e) =>
                              setPriceRange((prev) => ({
                                ...prev,
                                min: e.target.value,
                              }))
                            }
                            className="text-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            placeholder="Max price"
                            type="number"
                            value={priceRange.max}
                            onChange={(e) =>
                              setPriceRange((prev) => ({
                                ...prev,
                                max: e.target.value,
                              }))
                            }
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {loading || filteredPharmacies.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center flex-1 min-w-0 mb-8">
                <PharmaciesList
                  pharmacies={filteredPharmacies}
                  loading={loading}
                  onViewDetails={handleViewDetails}
                />
              </div>
              {/* Pagination Controls - deals style */}
              {!loading && !error && (totalPages || 1) > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages || 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((page, index) => (
                        <div key={index}>
                          {page === "..." ? (
                            <span className="px-2 py-1 text-muted-foreground">
                              ...
                            </span>
                          ) : (
                            <Button
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="w-8 h-8 p-0"
                            >
                              {page}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages || 1)
                        )
                      }
                      disabled={currentPage === (totalPages || 1)}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center min-h-[60vh]">
              <PharmaciesList pharmacies={[]} loading={false} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
