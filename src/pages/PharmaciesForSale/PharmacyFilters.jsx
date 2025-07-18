import { Input } from "../../components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Search, Loader2, ChevronDown, X } from "lucide-react";
import { Label } from "../../components/ui/label";

// Use the exact same governorate list as in pharmacy creation
const EGYPT_GOVERNORATES = [
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
];

const types = [
  { value: "pharmacy_only", label: "Pharmacy Only" },
  { value: "pharmacy_with_medicines", label: "Pharmacy with Medicines" },
];

export default function PharmacyFilters({
  filters,
  setFilters,
  onClear,
  isSearching = false,
  isPriceFiltering = false,
  showAdvancedFilters = false,
  sortBy = "",
  setSortBy = () => {},
  sortOptions = [],
}) {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const cityDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target)
      ) {
        setIsCityDropdownOpen(false);
        setCitySearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter cities based on search term
  const filteredCities = EGYPT_GOVERNORATES.filter((city) =>
    city.toLowerCase().includes(citySearchTerm.toLowerCase())
  );

  // Show first 6 cities initially, or filtered results if searching
  const displayedCities = citySearchTerm
    ? filteredCities
    : EGYPT_GOVERNORATES.slice(0, 6);

  const handleCitySelect = (city) => {
    setFilters((f) => ({ ...f, governorate: city })); // Use 'governorate' instead of 'city'
    setIsCityDropdownOpen(false);
    setCitySearchTerm("");
  };

  const handleCityClear = () => {
    setFilters((f) => ({ ...f, governorate: undefined })); // Use 'governorate' instead of 'city'
    setCitySearchTerm("");
  };

  return (
    <>
      {/* Basic Filters - match deals filter structure */}
      <div>
        <div className="flex flex-col gap-3 md:flex-row md:gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[180px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or location"
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, search: e.target.value }))
                }
                className="pl-10"
              />
            </div>
          </div>
          {/* Governorate Dropdown */}
          <div className="w-full md:w-44">
            <Select
              value={filters.governorate}
              onValueChange={(val) =>
                setFilters((f) => ({ ...f, governorate: val }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Governorate" />
              </SelectTrigger>
              <SelectContent>
                {EGYPT_GOVERNORATES.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Sale Type Dropdown */}
          <div className="w-full md:w-44">
            <Select
              value={filters.saleType}
              onValueChange={(val) =>
                setFilters((f) => ({ ...f, saleType: val }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Sort By Dropdown */}
          <div className="w-full md:w-44">
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value);
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
      {/* Advanced Filters - match deals filter structure for single group */}
      {showAdvancedFilters && (
        <div className="border-t pt-6">
          <div className="mb-4">
            <h4 className="text-md font-semibold text-gray-900 mb-2">
              Advanced Filters
            </h4>
            <p className="text-sm text-gray-500">Set price range filters</p>
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
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, minPrice: e.target.value }))
                    }
                    className="text-sm"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Max price"
                    type="number"
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, maxPrice: e.target.value }))
                    }
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
