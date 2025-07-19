import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  CheckCircle,
  TrendingUp,
  Clock,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, Search } from "lucide-react";
import DealCard from "../../components/DealCard";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDeals } from "../../store/useDeals";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";

export default function Deals() {
  const [searchInput, setSearchInput] = useState("");
  const [searchDeal, setSearchDeal] = useState("");
  const [status, setStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("expiryDate");

  // Advanced filters
  const [dealType, setDealType] = useState("");
  const [dosageForm, setDosageForm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9); // 9 deals per page (3x3 grid)

  // Use store
  const {
    deals,
    isLoading,
    error,
    fetchUserDeals,
    updateDealStatus,
    totalDeals,
    totalPages,
  } = useDeals();

  // Sorting options
  const sortOptions = [
    { value: "expiryDate-asc", label: "Expiry Date (Nearest First)" },
    { value: "price-asc", label: "Price (Low to High)" },
    { value: "quantity-asc", label: "Quantity (Low to High)" },
    { value: "createdAt-asc", label: "Created Date (Oldest First)" },
    { value: "medicineName-asc", label: "Name (A to Z)" },
  ];

  // Fetch deals with pagination
  const fetchDealsWithPagination = async (page = 1) => {
    const queryParams = {
      page,
      limit: pageSize,
      search: searchDeal || undefined,
      status: status || undefined,
      dealType: dealType || undefined,
      dosageForm: dosageForm || undefined,
      minPrice: priceRange.min || undefined,
      maxPrice: priceRange.max || undefined,
      fromDate: dateRange.from
        ? format(dateRange.from, "yyyy-MM-dd")
        : undefined,
      toDate: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
      sortBy: sortBy || undefined,
      sortOrder: sortOrder || undefined,
    };

    // Remove undefined values
    Object.keys(queryParams).forEach(
      (key) => queryParams[key] === undefined && delete queryParams[key]
    );

    await fetchUserDeals(queryParams);
  };

  useEffect(() => {
    fetchDealsWithPagination(currentPage);
  }, [currentPage, pageSize]);

  // Refetch when filters change
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchDealsWithPagination(1);
  }, [
    searchDeal,
    status,
    dealType,
    dosageForm,
    priceRange,
    dateRange,
    sortBy,
    sortOrder,
  ]);

  let filteredDeals = (deals || []).filter((deal) => {
    const dealStatus = deal.isClosed
      ? "Closed"
      : new Date(deal.expiryDate) < new Date()
      ? "Expired"
      : "Active";

    // Basic filters
    const matchesSearch = (deal.medicineName?.toLowerCase() || "").includes(
      searchDeal.toLowerCase()
    );
    const matchesStatus = dealStatus
      .toLowerCase()
      .includes(status.toLowerCase());

    // Advanced filters
    const matchesDealType = !dealType || deal.dealType === dealType;
    const matchesDosageForm = !dosageForm || deal.dosageForm === dosageForm;

    const dealPrice = parseFloat(deal.price || 0);
    const matchesPriceRange =
      (!priceRange.min || dealPrice >= parseFloat(priceRange.min)) &&
      (!priceRange.max || dealPrice <= parseFloat(priceRange.max));

    const dealDate = new Date(deal.expiryDate);
    const matchesDateRange =
      (!dateRange.from || dealDate >= dateRange.from) &&
      (!dateRange.to || dealDate <= dateRange.to);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesDealType &&
      matchesDosageForm &&
      matchesPriceRange &&
      matchesDateRange
    );
  });

  // Enhanced sorting
  const sortDeals = (dealsToSort) => {
    return [...dealsToSort].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "expiryDate":
          aValue = new Date(a.expiryDate).getTime();
          bValue = new Date(b.expiryDate).getTime();
          break;
        case "price":
          aValue = parseFloat(a.price || 0);
          bValue = parseFloat(b.price || 0);
          break;
        case "quantity":
          aValue = parseInt(a.quantity || 0);
          bValue = parseInt(b.quantity || 0);
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "medicineName":
          aValue = (a.medicineName || "").toLowerCase();
          bValue = (b.medicineName || "").toLowerCase();
          break;
        default:
          aValue = new Date(a.expiryDate).getTime();
          bValue = new Date(b.expiryDate).getTime();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  filteredDeals = sortDeals(filteredDeals);

  // Debounced search input
  const setSearchCallback = useCallback((value) => {
    setSearchDeal(value);
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

  const handleStatuses = (val) => {
    val === "all" ? setStatus("") : setStatus(val);
  };

  const handleDealType = (val) => {
    val === "all" ? setDealType("") : setDealType(val);
  };

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  // Handle sort selection from dropdown
  const handleSortSelection = (value) => {
    if (!value) {
      setSortBy("");
      setSortOrder("asc");
    } else {
      const [newSortBy, newSortOrder] = value.split("-");
      setSortBy(newSortBy);
      setSortOrder(newSortOrder);
    }
  };

  const handleClearFilters = () => {
    setSearchDeal("");
    setSearchInput("");
    setStatus("");
    setSortOrder("asc");
    setSortBy("expiryDate");
    setDealType("");
    setPriceRange({ min: "", max: "" });
    setDateRange({ from: null, to: null });
    setCurrentPage(1);
  };

  const handleCloseDeal = async (dealId) => {
    try {
      await updateDealStatus(dealId, true);
      toast.success("Deal has been successfully closed!");
    } catch (error) {
      toast.error(error.message || "Failed to close deal");
    }
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  // Calculate stats dynamically
  const activeDealsCount = (deals || []).filter(
    (deal) => !deal.isClosed && new Date(deal.expiryDate) >= new Date()
  ).length;
  const closedDealsCount = (deals || []).filter((deal) => deal.isClosed).length;
  const expiredDealsCount = (deals || []).filter(
    (deal) => !deal.isClosed && new Date(deal.expiryDate) < new Date()
  ).length;

  // Get active filters for chips
  const getActiveFilters = () => {
    const filters = [];
    if (searchDeal)
      filters.push({
        key: "search",
        label: `"${searchDeal}"`,
        onRemove: () => {
          setSearchDeal("");
          setSearchInput("");
        },
      });
    if (status)
      filters.push({
        key: "status",
        label: status,
        onRemove: () => setStatus(""),
      });
    if (dealType)
      filters.push({
        key: "type",
        label: dealType,
        onRemove: () => setDealType(""),
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
    return filters;
  };

  const activeFilters = getActiveFilters();

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen">
      <section className="py-10 px-4 text-foreground">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold">My Deals</h1>
          <Link to={"/deals/new"}>
            <Button className="w-full sm:w-auto">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Deal
            </Button>
          </Link>
        </div>
      </section>
      <section className="py-5 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card className="py-4 border-l-8 border-green-500 bg-gradient-to-br from-green-50 to-white shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Deals
                  </CardTitle>
                  <CardDescription className="text-3xl font-bold">
                    {activeDealsCount}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
            <Card className="py-4 border-l-8 border-blue-500 bg-gradient-to-br from-blue-50 to-white shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <CheckCircle className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Closed Deals
                  </CardTitle>
                  <CardDescription className="text-3xl font-bold">
                    {closedDealsCount}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
            <Card className="py-4 border-l-8 border-red-500 bg-gradient-to-br from-red-50 to-white shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Clock className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Expired Deals
                  </CardTitle>
                  <CardDescription className="text-3xl font-bold">
                    {expiredDealsCount}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Enhanced Filters */}
          <Card className="p-4 mb-8">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Filters
                  </h3>
                  <p className="text-sm text-gray-500">
                    Refine your search results
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    variant="outline"
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
                    onClick={handleClearFilters}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </div>

              {/* Basic Filters Row - rearranged to match AvailableDeals */}
              <div>
                <div className="flex flex-col gap-3 md:flex-row md:gap-4">
                  {/* Search */}
                  <div className="flex-1 min-w-[180px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        onChange={handleSearchInput}
                        value={searchInput}
                        placeholder="Search medicine name..."
                        className="pl-10"
                      />
                    </div>
                  </div>
                  {/* Deal Type Filter */}
                  <div className="w-full md:w-44">
                    <Select
                      onValueChange={handleDealType}
                      value={dealType || "all"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                        <SelectItem value="exchange">Exchange</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Dosage Form Filter */}
                  <div className="w-full md:w-44">
                    <Select
                      value={dosageForm || "all"}
                      onValueChange={(val) =>
                        setDosageForm(val === "all" ? "" : val)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Forms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Forms</SelectItem>
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="syrup">Syrup</SelectItem>
                        <SelectItem value="injection">Injection</SelectItem>
                        <SelectItem value="capsule">Capsule</SelectItem>
                        <SelectItem value="powder">Powder</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Sort By Filter */}
                  <div className="w-full md:w-44">
                    <Select
                      value={sortBy ? `${sortBy}-${sortOrder}` : ""}
                      onValueChange={handleSortSelection}
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
                    <Badge className="bg-zinc-600 text-white font-bold  text-xs">
                      {activeFilters.length}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeFilters.map((filter) => (
                      <Badge
                        key={filter.key}
                        className="flex items-center gap-1 bg-zinc-600 text-white font-bold  cursor-pointer hover:bg-zinc-800/30 transition-colors"
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
                      Set price range and expiry date filters
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    {/* Date Range */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">
                        Expiry Date Range
                      </Label>
                      <div className="flex gap-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex-1 justify-start text-left font-normal text-sm"
                            >
                              {dateRange.from
                                ? format(dateRange.from, "MMM dd, yyyy")
                                : "From date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
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
                              className="flex-1 justify-start text-left font-normal text-sm"
                            >
                              {dateRange.to
                                ? format(dateRange.to, "MMM dd, yyyy")
                                : "To date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
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
          {isLoading && (
            <div className="text-center py-8 text-lg text-muted-foreground">
              Loading deals...
            </div>
          )}
          {error && (
            <div className="text-center py-8 text-lg text-red-500">{error}</div>
          )}

          {/* Results Summary */}
          {!isLoading && !error && (
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {deals?.length || 0} of {totalDeals || 0} deals (Page{" "}
                {currentPage} of {totalPages || 1})
              </div>
            </div>
          )}

          {/* Deals Grid */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredDeals.map((deal, index) => (
                <DealCard
                  key={deal.id || index}
                  deal={deal}
                  onClose={handleCloseDeal}
                />
              ))}
              {filteredDeals.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  {activeFilters.length > 0
                    ? "No deals match your filters. Try adjusting your search criteria."
                    : "No deals found."}
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
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
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
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
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
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
