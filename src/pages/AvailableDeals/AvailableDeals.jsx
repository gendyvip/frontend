import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Tag, Filter, X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search, User2 } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { useNavigate } from 'react-router-dom';
import { useDeals } from '../../store/useDeals';
import { useAuth } from '../../store/useAuth';
import MedicineDealCard from '@/components/MedicineDealCard';
import MedicineDealCardSkeleton from '@/components/MedicineDealCardSkeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { useDebounce } from '@/hooks/useDebounce';
import { Card } from '@/components/ui/card';

export default function AvailableDeals() {
  // State for all filters
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [dosageForm, setDosageForm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [showMyDeals, setShowMyDeals] = useState(false);

  const { deals, fetchDeals, isLoading, error, totalDeals, totalPages } = useDeals();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get current user ID from localStorage
  const currentUserId = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  // Debounce search input
  const setSearchCallback = useCallback((value) => {
    setSearch(value);
  }, []);
  const debouncedSetSearch = useDebounce(setSearchCallback, 500);
  const handleSearchInput = useCallback((e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSetSearch(value);
  }, [debouncedSetSearch]);

  // Build query params for backend
  const buildQueryParams = useCallback(() => {
    const params = {
      page: currentPage,
      status: 'active',
    };
    if (search) params.search = search;
    if (type) params.type = type;
    if (location) params.location = location;
    if (dosageForm) params.dosageForm = dosageForm;
    if (priceRange.min) params.minPrice = priceRange.min;
    if (priceRange.max) params.maxPrice = priceRange.max;
    if (dateRange.from) params.startExpiry = format(dateRange.from, 'yyyy-MM-dd');
    if (dateRange.to) params.endExpiry = format(dateRange.to, 'yyyy-MM-dd');
    if (sortBy) params.sort = sortOrder === 'desc' ? `-${sortBy}` : sortBy;
    
    // Handle my deals vs others deals
    if (showMyDeals) {
      // Show only my deals
      if (currentUserId) params.userId = currentUserId;
    } else {
      // Show only others' deals (exclude my deals)
      if (currentUserId) params.excludeUserId = currentUserId;
    }
    
    return params;
  }, [search, type, location, dosageForm, priceRange, dateRange, sortBy, sortOrder, currentPage, currentUserId, showMyDeals]);

  // Fetch deals from backend when filters/pagination change
  useEffect(() => {
    fetchDeals(buildQueryParams());
  }, [buildQueryParams, fetchDeals]);

  // Update available types and locations whenever deals change
  useEffect(() => {
    setAvailableTypes(Array.from(new Set((deals || []).map(deal => deal.dealType).filter(Boolean))));
    setAvailableLocations(Array.from(new Set((deals || []).map(deal => deal.pharmacy?.city).filter(Boolean))));
  }, [deals]);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearch('');
    setSearchInput('');
    setType('');
    setLocation('');
    setDosageForm('');
    setPriceRange({ min: '', max: '' });
    setDateRange({ from: null, to: null });
    setSortBy('');
    setSortOrder('asc');
    setCurrentPage(1);
    setShowMyDeals(false);
  }, []);

  // Toggle show my deals
  const handleToggleMyDeals = useCallback(() => {
    setShowMyDeals(prev => !prev);
    setCurrentPage(1); // Reset to first page when switching
  }, []);

  // Active filter chips
  const getActiveFilters = useMemo(() => {
    const filters = [];
    if (search) filters.push({ 
      key: 'search', 
      label: `"${search}"`, 
      onRemove: () => { 
        setSearch(''); 
        setSearchInput(''); 
      } 
    });
    if (type) filters.push({ key: 'type', label: type, onRemove: () => setType('') });
    if (location) filters.push({ key: 'location', label: location, onRemove: () => setLocation('') });
    if (dosageForm) filters.push({ key: 'dosageForm', label: dosageForm, onRemove: () => setDosageForm('') });
    if (priceRange.min) filters.push({ key: 'minPrice', label: `Min: EGP ${priceRange.min}`, onRemove: () => setPriceRange(prev => ({ ...prev, min: '' })) });
    if (priceRange.max) filters.push({ key: 'maxPrice', label: `Max: EGP ${priceRange.max}`, onRemove: () => setPriceRange(prev => ({ ...prev, max: '' })) });
    if (dateRange.from) filters.push({ key: 'fromDate', label: `From: ${format(dateRange.from, 'MMM dd')}`, onRemove: () => setDateRange(prev => ({ ...prev, from: null })) });
    if (dateRange.to) filters.push({ key: 'toDate', label: `To: ${format(dateRange.to, 'MMM dd')}`, onRemove: () => setDateRange(prev => ({ ...prev, to: null })) });
    if (showMyDeals) filters.push({ 
      key: 'showMyDeals', 
      label: 'My Deals Only', 
      onRemove: () => setShowMyDeals(false) 
    });
    return filters;
  }, [search, type, location, dosageForm, priceRange, dateRange, showMyDeals]);
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
        pages.push('...');
        pages.push(total);
      } else if (currentPage >= total - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 3; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      }
    }
    return pages;
  };

  // Sorting handler
  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const sortOptions = [
    { value: 'expiryDate-asc', label: 'Expiry Date (Nearest First)' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'quantity-asc', label: 'Quantity (Low to High)' },
    { value: 'createdAt-asc', label: 'Created Date (Oldest First)' },
    { value: 'medicineName-asc', label: 'Name (A to Z)' },
  ];

  // Remove frontend filtering - let backend handle all filtering
  const filteredDeals = useMemo(() => {
    return deals || [];
  }, [deals]);

  return (
    <div className="min-h-screen">
      <section className="py-5 px-4 text-foreground">
        <div className="max-w-7xl mx-auto flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">
            {showMyDeals ? "My Medicine Deals" : "Available Medicine Deals"}
          </h1>
          <Button onClick={() => navigate('/my-deals')} className="text-xl text-white bg-primary">
            My Deals
          </Button>
        </div>
      </section>
      
      <section className="px-4">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Filters Card */}
          <Card className="p-6 mb-8">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <p className="text-sm text-gray-500">Refine your search results</p>
        </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleToggleMyDeals}
                    variant={showMyDeals ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <User2 className="h-4 w-4" />
                    Show My Deals
                  </Button>
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
                    {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
                </div>
              </div>

              {/* Basic Filters */}
              <div>
                <div className="flex flex-col gap-3 md:flex-row md:gap-4">
                  <div className="flex-1 min-w-[180px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by medicine name..."
                        value={searchInput}
                        onChange={handleSearchInput}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-44">
            <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Types" />
              </SelectTrigger>
              <SelectContent>
                {availableTypes.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
                  </div>
                  <div className="w-full md:w-44">
            <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Locations" />
              </SelectTrigger>
              <SelectContent>
                {availableLocations.map(l => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
                  </div>
                  <div className="w-full md:w-44">
                    <Select value={dosageForm} onValueChange={setDosageForm}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Forms" />
                      </SelectTrigger>
                      <SelectContent>
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
                    <Select value={sortBy ? `${sortBy}-${sortOrder}` : ''} onValueChange={(value) => {
                      if (!value) {
                        setSortBy('');
                        setSortOrder('asc');
                      } else {
                        const [newSortBy, newSortOrder] = value.split('-');
                        setSortBy(newSortBy);
                        setSortOrder(newSortOrder);
                      }
                    }}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
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
                    <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                    <Badge className="bg-zinc-600 text-white text-xs">
                      {activeFilters.length}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
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
                    <h4 className="text-md font-semibold text-gray-900 mb-2">Advanced Filters</h4>
                    <p className="text-sm text-gray-500">Set price range and expiry date filters</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Price Range */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">Price Range (EGP)</Label>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <Input
                            placeholder="Min price"
                            type="number"
                            value={priceRange.min}
                            onChange={e => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                            className="text-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            placeholder="Max price"
                            type="number"
                            value={priceRange.max}
                            onChange={e => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                            className="text-sm"
                          />
                        </div>
                      </div>
          </div>
          
                    {/* Date Range */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">Expiry Date Range</Label>
                      <div className="flex gap-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="flex-1 justify-start text-left font-normal text-sm">
                              {dateRange.from ? format(dateRange.from, "MMM dd, yyyy") : "From date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-[9999]">
                            <Calendar
                              mode="single"
                              selected={dateRange.from}
                              onSelect={date => setDateRange(prev => ({ ...prev, from: date }))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="flex-1 justify-start text-left font-normal text-sm">
                              {dateRange.to ? format(dateRange.to, "MMM dd, yyyy") : "To date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 z-[9999]">
                            <Calendar
                              mode="single"
                              selected={dateRange.to}
                              onSelect={date => setDateRange(prev => ({ ...prev, to: date }))}
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
            <div className="text-center py-8 text-lg text-red-500">{error}</div>
          )}

          {/* Results Summary */}
          {!isLoading && !error && (
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {(deals?.length ? (currentPage - 1) * 9 + 1 : 0)}-{Math.min(currentPage * 9, totalDeals || 0)} of {totalDeals || 0} deals (Page {currentPage} of {totalPages || 1})
              </div>
            </div>
          )}

          {/* Deals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {isLoading
              ? [...Array(9)].map((_, i) => <MedicineDealCardSkeleton key={i} />)
              : filteredDeals.map(deal => <MedicineDealCard key={deal.id} deal={deal} />)
            }
            {!isLoading && filteredDeals.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-8 flex flex-col items-center">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
                  <rect x="12" y="16" width="40" height="52" rx="6" fill="#f3f4f6" stroke="#888" strokeWidth="2"/>
                  <rect x="22" y="28" width="20" height="4" rx="2" fill="#d1d5db" />
                  <rect x="22" y="38" width="24" height="4" rx="2" fill="#d1d5db" />
                  <rect x="22" y="48" width="16" height="4" rx="2" fill="#d1d5db" />
                  <circle cx="58" cy="58" r="12" fill="#f3f4f6" stroke="#888" strokeWidth="2"/>
                  <line x1="66" y1="66" x2="75" y2="75" stroke="#888" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="58" cy="58" r="5" fill="#d1d5db" />
                </svg>
                {activeFilters.length > 0 ? "No deals match your filters. Try adjusting your search criteria." : "No deals found."}
              </div>
            )}
          </div>
          
          {/* Pagination Controls */}
          {!isLoading && !error && (totalPages || 1) > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages || 1}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    <div key={index}>
                      {page === '...' ? (
                        <span className="px-2 py-1 text-muted-foreground">...</span>
                      ) : (
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages || 1))}
                  disabled={currentPage === (totalPages || 1)}
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
