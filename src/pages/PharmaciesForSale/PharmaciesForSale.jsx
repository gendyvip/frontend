import { useEffect, useState } from "react";
import { getPharmaciesForSale } from "../../api/pharmacies";
import PharmacyFilters from "./PharmacyFilters";
import PharmaciesList from "./PharmaciesList";
import { useAuth } from "../../store/useAuth";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";

export default function PharmaciesForSale() {
  const [filters, setFilters] = useState({});
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = useAuth((state) => state.token);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Debounced filters for API calls
  const [debouncedFilters, setDebouncedFilters] = useState({});

  // Create debounced function for filter updates
  const debouncedSetFilters = useDebounce((newFilters) => {
    setDebouncedFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  }, 500);

  // Update debounced filters when filters change
  useEffect(() => {
    // For search text and price inputs, use debounce
    if (
      filters.search !== debouncedFilters.search ||
      filters.minPrice !== debouncedFilters.minPrice ||
      filters.maxPrice !== debouncedFilters.maxPrice
    ) {
      debouncedSetFilters(filters);
    } else {
      // For dropdown filters (governorate, sale type), apply immediately
      setDebouncedFilters(filters);
      setPage(1);
    }
  }, [
    filters,
    debouncedSetFilters,
    debouncedFilters.search,
    debouncedFilters.minPrice,
    debouncedFilters.maxPrice,
  ]);

  // Active filter chips
  const getActiveFilters = () => {
    const chips = [];
    if (filters.search)
      chips.push({
        key: "search",
        label: `"${filters.search}"`,
        onRemove: () => setFilters((f) => ({ ...f, search: undefined })),
      });
    if (filters.governorate)
      chips.push({
        key: "governorate",
        label: filters.governorate,
        onRemove: () => setFilters((f) => ({ ...f, governorate: undefined })),
      });
    if (filters.saleType)
      chips.push({
        key: "saleType",
        label:
          filters.saleType === "pharmacy_with_medicines"
            ? "With Medicines"
            : "Pharmacy Only",
        onRemove: () => setFilters((f) => ({ ...f, saleType: undefined })),
      });
    if (filters.minPrice)
      chips.push({
        key: "minPrice",
        label: `Min: EGP ${filters.minPrice}`,
        onRemove: () => setFilters((f) => ({ ...f, minPrice: undefined })),
      });
    if (filters.maxPrice)
      chips.push({
        key: "maxPrice",
        label: `Max: EGP ${filters.maxPrice}`,
        onRemove: () => setFilters((f) => ({ ...f, maxPrice: undefined })),
      });
    return chips;
  };
  const activeFilters = getActiveFilters();

  const fetchPharmacies = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        ...debouncedFilters,
        page,
        size: 9,
        minPrice: debouncedFilters.minPrice,
        maxPrice: debouncedFilters.maxPrice,
      };
      const res = await getPharmaciesForSale(params, token);
      setPharmacies(res.data.pharmacies || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setError(err.message || "Failed to load pharmacies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacies();
    // eslint-disable-next-line
  }, [debouncedFilters, page, token]);

  const handleClearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const handleViewDetails = (pharmacy) => {
    navigate(`/pharmacies-for-sale/${pharmacy.id}`);
  };

  // Only show pharmacies not owned by the current user
  const filteredPharmacies = pharmacies.filter(
    (pharmacy) => !(pharmacy.owner && pharmacy.owner.id === user)
  );

  return (
    <div className="min-h-screen bg-background">
      <section className="py-10 px-4 text-foreground">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold ">
            Pharmacies for Sale
          </h1>
        </div>
      </section>
      <section className="py-5 px-4">
        <div className="max-w-6xl mx-auto flex flex-col flex-1">
          {/* Filters Card */}
          <Card className="p-6 mb-8 rounded-2xl shadow-md border border-primary/20 bg-white">
            <PharmacyFilters
              filters={filters}
              setFilters={setFilters}
              onClear={handleClearFilters}
              isSearching={
                filters.search && filters.search !== debouncedFilters.search
              }
              isPriceFiltering={
                (filters.minPrice &&
                  filters.minPrice !== debouncedFilters.minPrice) ||
                (filters.maxPrice &&
                  filters.maxPrice !== debouncedFilters.maxPrice)
              }
            />
            {/* Active Filter Chips */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 mt-2">
                {activeFilters.map((filter) => (
                  <Badge
                    key={filter.key}
                    variant="secondary"
                    className="flex items-center gap-1 cursor-pointer hover:bg-primary/10 text-primary border border-primary/30 bg-primary/5"
                    onClick={filter.onRemove}
                  >
                    {filter.label}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </Card>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {loading || filteredPharmacies.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-1">
                <PharmaciesList
                  pharmacies={filteredPharmacies}
                  loading={loading}
                  onViewDetails={handleViewDetails}
                />
              </div>
              {/* Pagination */}
              {filteredPharmacies.length > 0 && (
                <div className="flex justify-center mt-10">
                  <button
                    className="px-5 py-2 mx-1 rounded-lg bg-primary text-white font-semibold disabled:opacity-50"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-primary font-medium">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="px-5 py-2 mx-1 rounded-lg bg-primary text-white font-semibold disabled:opacity-50"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
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
