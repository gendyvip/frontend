import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Tag,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  User2,
  MapPin,
  MapPinOff,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useNavigate } from "react-router-dom";
import { useDeals } from "../../store/useDeals";
import { useAuth } from "../../store/useAuth";
import MedicineDealCard from "@/components/MedicineDealCard";
import MedicineDealCardSkeleton from "@/components/MedicineDealCardSkeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/useDebounce";
import { Card } from "@/components/ui/card";
import CornerAd from "@/components/ui/CornerAd";
import { DrugAlert } from "@/components/DrugAlert";

export default function AvailableDeals() {
  // State for all filters
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [dosageForm, setDosageForm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [showMyDeals, setShowMyDeals] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: null, long: null });
  const [useLocationSort, setUseLocationSort] = useState(false);
  const [locationError, setLocationError] = useState("");

  const { deals, fetchDeals, isLoading, error, totalDeals, totalPages } =
    useDeals();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get current user ID from localStorage - memoized to prevent infinite re-renders
  const currentUserId = useMemo(() => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return null;

      const parsedUser = JSON.parse(userData);
      // Handle both cases: user could be the full object or just the ID
      return typeof parsedUser === "object" ? parsedUser.id : parsedUser;
    } catch {
      return null;
    }
  }, []);

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

  // Handler for location sort toggle
  const handleLocationSortToggle = () => {
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
            setLocationError("Location access denied or unavailable.");
            setUseLocationSort(false);
          }
        );
      } else {
        setLocationError("Geolocation is not supported by your browser.");
      }
    } else {
      // Disable location sort
      setUseLocationSort(false);
      setUserLocation({ lat: null, long: null });
      setLocationError("");
    }
  };

  // Build query params for backend
  const buildQueryParams = useCallback(() => {
    const params = {
      page: currentPage,
      status: "active",
    };
    if (search) params.search = search;
    if (type) params.type = type;
    if (location) params.location = location;
    if (dosageForm) params.dosageForm = dosageForm;
    if (priceRange.min) params.minPrice = priceRange.min;
    if (priceRange.max) params.maxPrice = priceRange.max;
    if (dateRange.from)
      params.startExpiry = format(dateRange.from, "yyyy-MM-dd");
    if (dateRange.to) params.endExpiry = format(dateRange.to, "yyyy-MM-dd");
    if (sortBy) params.sort = sortOrder === "desc" ? `-${sortBy}` : sortBy;

    // Handle my deals vs others deals
    if (showMyDeals) {
      // Show only my deals
      if (currentUserId) params.userId = currentUserId;
    } else {
      // Show only others' deals (exclude my deals)
      if (currentUserId) params.excludeUserId = currentUserId;
    }

    // Add location if location sort is enabled
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
    type,
    location,
    dosageForm,
    priceRange.min,
    priceRange.max,
    dateRange.from,
    dateRange.to,
    sortBy,
    sortOrder,
    currentPage,
    currentUserId,
    showMyDeals,
    useLocationSort,
    userLocation.lat,
    userLocation.long,
  ]);

  // Fetch deals from backend when filters/pagination change
  useEffect(() => {
    fetchDeals(buildQueryParams());
  }, [buildQueryParams]);

  // Update available types and locations whenever deals change
  useEffect(() => {
    setAvailableTypes(
      Array.from(
        new Set((deals || []).map((deal) => deal.dealType).filter(Boolean))
      )
    );
    setAvailableLocations(
      Array.from(
        new Set(
          (deals || []).map((deal) => deal.pharmacy?.city).filter(Boolean)
        )
      )
    );
  }, [deals]);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearch("");
    setSearchInput("");
    setType("");
    setLocation("");
    setDosageForm("");
    setPriceRange({ min: "", max: "" });
    setDateRange({ from: null, to: null });
    setSortBy("");
    setSortOrder("asc");
    setCurrentPage(1);
    setShowMyDeals(false);
    setUseLocationSort(false);
    setUserLocation({ lat: null, long: null });
    setLocationError("");
  }, []);

  // Toggle show my deals
  const handleToggleMyDeals = useCallback(() => {
    setShowMyDeals((prev) => !prev);
    setCurrentPage(1); // Reset to first page when switching
  }, []);

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
    if (type)
      filters.push({ key: "type", label: type, onRemove: () => setType("") });
    if (location)
      filters.push({
        key: "location",
        label: location,
        onRemove: () => setLocation(""),
      });
    if (dosageForm)
      filters.push({
        key: "dosageForm",
        label: dosageForm,
        onRemove: () => setDosageForm(""),
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
    if (dateRange.from)
      filters.push({
        key: "fromDate",
        label: `From: ${format(dateRange.from, "MMM dd")}`,
        onRemove: () => setDateRange((prev) => ({ ...prev, from: null })),
      });
    if (dateRange.to)
      filters.push({
        key: "toDate",
        label: `To: ${format(dateRange.to, "MMM dd")}`,
        onRemove: () => setDateRange((prev) => ({ ...prev, to: null })),
      });
    if (showMyDeals)
      filters.push({
        key: "showMyDeals",
        label: "My Deals Only",
        onRemove: () => setShowMyDeals(false),
      });
    if (useLocationSort)
      filters.push({
        key: "useLocationSort",
        label: "Nearest Pharmacy",
        onRemove: () => setUseLocationSort(false),
      });
    return filters;
  }, [
    search,
    type,
    location,
    dosageForm,
    priceRange,
    dateRange,
    showMyDeals,
    useLocationSort,
  ]);
  const activeFilters = getActiveFilters;

  // Pagination page numbers (with ellipsis)
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

  // Sorting handler
  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const sortOptions = [
    { value: "expiryDate-asc", label: "Expiry Date (Nearest First)" },
    { value: "price-asc", label: "Price (Low to High)" },
    { value: "quantity-asc", label: "Quantity (Low to High)" },
    { value: "createdAt-asc", label: "Created Date (Oldest First)" },
    { value: "medicineName-asc", label: "Name (A to Z)" },
  ];

  // Remove frontend filtering - let backend handle all filtering
  const filteredDeals = useMemo(() => {
    return deals || [];
  }, [deals]);

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <CornerAd position="allDeals" />

      <section className="py-5 px-4 text-foreground dark:text-foreground">
        <div className="max-w-7xl mx-auto flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">
            {showMyDeals ? "My Medicine Deals" : "Available Medicine Deals"}
          </h1>
          <Button
            onClick={() => navigate("/my-deals")}
            className="text-xl text-white bg-primary dark:bg-primary"
          >
            My Deals
          </Button>
        </div>
      </section>

      <section className="px-4">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Filters Card */}
          <Card className="p-6 mb-8 bg-white dark:bg-card border border-gray-200 dark:border-border">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-2 w-full sm:w-auto">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground">
                    Filters
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Refine your search results
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start">
                  <Button
                    onClick={handleToggleMyDeals}
                    variant={showMyDeals ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-2 border-gray-200 dark:border-border bg-white dark:bg-background text-primary dark:text-primary"
                  >
                    <User2 className="h-4 w-4" />
                    Show My Deals
                  </Button>
                  <Button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-gray-200 dark:border-border bg-white dark:bg-background text-primary dark:text-primary"
                  >
                    <Filter className="h-4 w-4" />
                    Advanced
                    {activeFilters.length > 0 && (
                      <Badge className="bg-zinc-600 dark:bg-zinc-800 text-white ml-1">
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
                    className="flex items-center gap-2 border-gray-200 dark:border-border bg-white dark:bg-background text-primary dark:text-primary"
                  >
                    <X className="h-4 w-4" />
                    Clear All
                  </Button>
                  {/* Location Sort Button */}
                  <Button
                    type="button"
                    variant={useLocationSort ? "default" : "outline"}
                    size="sm"
                    className={`flex items-center gap-2 ${
                      useLocationSort
                        ? "bg-primary text-white border-primary"
                        : "bg-white dark:bg-background text-primary border-primary/30 dark:border-primary/40 hover:bg-primary/10 dark:hover:bg-primary/10"
                    }`}
                    title={
                      useLocationSort
                        ? "Sorted by nearest"
                        : "Sort by nearest pharmacy"
                    }
                    onClick={handleLocationSortToggle}
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
                <div className="text-red-500 dark:text-red-400 text-sm mb-2">
                  {locationError}
                </div>
              )}

              {/* Basic Filters */}
              <div>
                <div className="flex flex-col gap-3 md:flex-row md:gap-4">
                  <div className="flex-1 min-w-[180px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        placeholder="Search by medicine name..."
                        value={searchInput}
                        onChange={handleSearchInput}
                        className="pl-10 bg-white dark:bg-background text-gray-900 dark:text-foreground border-gray-200 dark:border-border"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-44">
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="w-full bg-white dark:bg-background border-gray-200 dark:border-border text-gray-900 dark:text-foreground">
                        <SelectValue placeholder="Types" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-background text-gray-900 dark:text-foreground">
                        {availableTypes.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full md:w-44">
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger className="w-full bg-white dark:bg-background border-gray-200 dark:border-border text-gray-900 dark:text-foreground">
                        <SelectValue placeholder="Locations" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-background text-gray-900 dark:text-foreground">
                        {availableLocations.map((l) => (
                          <SelectItem key={l} value={l}>
                            {l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full md:w-44">
                    <Select value={dosageForm} onValueChange={setDosageForm}>
                      <SelectTrigger className="w-full bg-white dark:bg-background border-gray-200 dark:border-border text-gray-900 dark:text-foreground">
                        <SelectValue placeholder="Forms" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-background text-gray-900 dark:text-foreground">
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="syrup">Syrup</SelectItem>
                        <SelectItem value="injection">Injection</SelectItem>
                        <SelectItem value="capsule">Capsule</SelectItem>
                        <SelectItem value="powder">Powder</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
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
                      <SelectTrigger className="w-full bg-white dark:bg-background border-gray-200 dark:border-border text-gray-900 dark:text-foreground">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-background text-gray-900 dark:text-foreground">
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
                <div className="border-t border-gray-200 dark:border-border pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active Filters:
                    </span>
                    <Badge className="bg-zinc-600 dark:bg-zinc-800 text-white text-xs">
                      {activeFilters.length}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 overflow-x-auto max-w-full">
                    {activeFilters.map((filter) => (
                      <Badge
                        key={filter.key}
                        className="flex items-center gap-1 cursor-pointer bg-zinc-600 dark:bg-zinc-800 text-white hover:bg-zinc-600/70 dark:hover:bg-zinc-700 transition-colors"
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
                <div className="border-t border-gray-200 dark:border-border pt-6">
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-foreground mb-2">
                      Advanced Filters
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Set price range and expiry date filters
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Price Range */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                            className="text-sm bg-white dark:bg-background text-gray-900 dark:text-foreground border-gray-200 dark:border-border"
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
                            className="text-sm bg-white dark:bg-background text-gray-900 dark:text-foreground border-gray-200 dark:border-border"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Date Range */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Expiry Date Range
                      </Label>
                      <div className="flex gap-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex-1 justify-start text-left font-normal text-sm border-gray-200 dark:border-border bg-white dark:bg-background text-gray-900 dark:text-foreground"
                            >
                              {dateRange.from
                                ? format(dateRange.from, "MMM dd, yyyy")
                                : "From date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-[9999] bg-white dark:bg-background text-gray-900 dark:text-foreground">
                            <Calendar
                              mode="single"
                              selected={dateRange.from}
                              onSelect={(date) =>
                                setDateRange((prev) => ({
                                  ...prev,
                                  from: date,
                                }))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex-1 justify-start text-left font-normal text-sm border-gray-200 dark:border-border bg-white dark:bg-background text-gray-900 dark:text-foreground"
                            >
                              {dateRange.to
                                ? format(dateRange.to, "MMM dd, yyyy")
                                : "To date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-[9999] bg-white dark:bg-background text-gray-900 dark:text-foreground">
                            <Calendar
                              mode="single"
                              selected={dateRange.to}
                              onSelect={(date) =>
                                setDateRange((prev) => ({ ...prev, to: date }))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Loading and Error States */}
          {error && (
            <div className="text-center py-8 text-lg text-red-500 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Results Summary */}
          {!isLoading && !error && (
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground dark:text-gray-400">
                Showing {deals?.length ? (currentPage - 1) * 9 + 1 : 0}-
                {Math.min(currentPage * 9, totalDeals || 0)} of{" "}
                {totalDeals || 0} deals (Page {currentPage} of {totalPages || 1}
                )
              </div>
            </div>
          )}

          {/* Deals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {isLoading
              ? [...Array(3)].map((_, i) => (
                  <MedicineDealCardSkeleton key={i} />
                ))
              : filteredDeals.map((deal) => (
                  <MedicineDealCard key={deal.id} deal={deal} />
                ))}
            {!isLoading && filteredDeals.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground dark:text-gray-400 py-8 flex flex-col items-center">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-4"
                >
                  <rect
                    x="12"
                    y="16"
                    width="40"
                    height="52"
                    rx="6"
                    fill="#f3f4f6"
                    stroke="#888"
                  />
                  <rect
                    x="22"
                    y="28"
                    width="20"
                    height="4"
                    rx="2"
                    fill="#d1d5db"
                  />
                  <rect
                    x="22"
                    y="38"
                    width="24"
                    height="4"
                    rx="2"
                    fill="#d1d5db"
                  />
                  <rect
                    x="22"
                    y="48"
                    width="16"
                    height="4"
                    rx="2"
                    fill="#d1d5db"
                  />
                  <circle cx="58" cy="58" r="12" fill="#f3f4f6" stroke="#888" />
                  <line
                    x1="66"
                    y1="66"
                    x2="75"
                    y2="75"
                    stroke="#888"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="58" cy="58" r="5" fill="#d1d5db" />
                </svg>
                {activeFilters.length > 0
                  ? "No deals match your filters. Try adjusting your search criteria."
                  : "No deals found."}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {!isLoading && !error && (totalPages || 1) > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground dark:text-gray-400">
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
                  className="border-gray-200 dark:border-border bg-white dark:bg-background text-primary dark:text-primary"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    <div key={index}>
                      {page === "..." ? (
                        <span className="px-2 py-1 text-muted-foreground dark:text-gray-400">
                          ...
                        </span>
                      ) : (
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 p-0 ${
                            currentPage === page
                              ? "bg-primary text-white border-primary"
                              : "bg-white dark:bg-background text-primary border-gray-200 dark:border-border hover:bg-primary/10 dark:hover:bg-primary/10"
                          }`}
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
                  className="border-gray-200 dark:border-border bg-white dark:bg-background text-primary dark:text-primary"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}