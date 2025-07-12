import { create } from "zustand";
import {
  getUserFavorites,
  addDealToFavorites,
  addPharmacyToFavorites,
  removeDealFromFavorites,
  removePharmacyFromFavorites,
} from "../api/favourite";

export const useFav = create((set, get) => ({
  favorites: {
    deals: [],
    pharmacies: [],
  },
  isLoading: false,
  error: null,
  isInitialized: false,

  // Fetch user favorites
  fetchFavorites: async (force = false) => {
    const { isInitialized } = get();
    if (isInitialized && !force) return; // Don't fetch if already loaded unless forced

    set({ isLoading: true, error: null });

    try {
      const response = await getUserFavorites();
      const favorites = response.data || { deals: [], pharmacies: [] };

      set({
        favorites: {
          deals: favorites.deals || [],
          pharmacies: favorites.pharmacies || [],
        },
        // isLoading: false,
        error: null,
        isInitialized: true,
      });

      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Failed to fetch favorites",
        isInitialized: true, // Mark as initialized even on error
      });
      throw error;
    }
  },

  // Add deal to favorites with optimistic update
  addDealToFavorites: async (dealId) => {
    const { favorites } = get();

    // Optimistic update - immediately add to local state
    const optimisticDeal = { id: dealId };
    set((state) => ({
      favorites: {
        ...state.favorites,
        deals: [...state.favorites.deals, optimisticDeal],
      },
      isLoading: true,
      error: null,
    }));

    try {
      const response = await addDealToFavorites(dealId);

      // Update with actual data from server
      set((state) => ({
        favorites: {
          ...state.favorites,
          deals: state.favorites.deals.map((deal) =>
            deal.id === dealId ? response.data?.deal || optimisticDeal : deal
          ),
        },
        isLoading: false,
        error: null,
      }));

      return response;
    } catch (error) {
      // Revert optimistic update on error
      set((state) => ({
        favorites: {
          ...state.favorites,
          deals: state.favorites.deals.filter((deal) => deal.id !== dealId),
        },
        isLoading: false,
        error: error.message || "Failed to add deal to favorites",
      }));
      throw error;
    }
  },

  // Add pharmacy to favorites with optimistic update
  addPharmacyToFavorites: async (pharmacyId) => {
    const { favorites } = get();

    // Optimistic update - immediately add to local state
    const optimisticPharmacy = { id: pharmacyId };
    set((state) => ({
      favorites: {
        ...state.favorites,
        pharmacies: [...state.favorites.pharmacies, optimisticPharmacy],
      },
      isLoading: true,
      error: null,
    }));

    try {
      const response = await addPharmacyToFavorites(pharmacyId);

      // Update with actual data from server
      set((state) => ({
        favorites: {
          ...state.favorites,
          pharmacies: state.favorites.pharmacies.map((pharmacy) =>
            pharmacy.id === pharmacyId
              ? response.data?.pharmacy || optimisticPharmacy
              : pharmacy
          ),
        },
        isLoading: false,
        error: null,
      }));

      return response;
    } catch (error) {
      // Revert optimistic update on error
      set((state) => ({
        favorites: {
          ...state.favorites,
          pharmacies: state.favorites.pharmacies.filter(
            (pharmacy) => pharmacy.id !== pharmacyId
          ),
        },
        isLoading: false,
        error: error.message || "Failed to add pharmacy to favorites",
      }));
      throw error;
    }
  },

  // Remove deal from favorites with optimistic update
  removeDealFromFavorites: async (dealId) => {
    const { favorites } = get();

    // Optimistic update - immediately remove from local state
    set((state) => ({
      favorites: {
        ...state.favorites,
        deals: state.favorites.deals.filter((deal) => deal.id !== dealId),
      },
      isLoading: true,
      error: null,
    }));

    try {
      const response = await removeDealFromFavorites(dealId);
      set({ isLoading: false, error: null });
      return response;
    } catch (error) {
      // Revert optimistic update on error
      set((state) => ({
        favorites: {
          ...state.favorites,
          deals: [...state.favorites.deals, { id: dealId }],
        },
        isLoading: false,
        error: error.message || "Failed to remove deal from favorites",
      }));
      throw error;
    }
  },

  // Remove pharmacy from favorites with optimistic update
  removePharmacyFromFavorites: async (pharmacyId) => {
    const { favorites } = get();

    // Optimistic update - immediately remove from local state
    set((state) => ({
      favorites: {
        ...state.favorites,
        pharmacies: state.favorites.pharmacies.filter(
          (pharmacy) => pharmacy.id !== pharmacyId
        ),
      },
      isLoading: true,
      error: null,
    }));

    try {
      const response = await removePharmacyFromFavorites(pharmacyId);
      set({ isLoading: false, error: null });
      return response;
    } catch (error) {
      // Revert optimistic update on error
      set((state) => ({
        favorites: {
          ...state.favorites,
          pharmacies: [...state.favorites.pharmacies, { id: pharmacyId }],
        },
        isLoading: false,
        error: error.message || "Failed to remove pharmacy from favorites",
      }));
      throw error;
    }
  },

  // Check if a deal is in favorites
  isDealFavorite: (dealId) => {
    const { favorites } = get();
    return favorites.deals.some((deal) => deal.id === dealId);
  },

  // Check if a pharmacy is in favorites
  isPharmacyFavorite: (pharmacyId) => {
    const { favorites } = get();
    return favorites.pharmacies.some((pharmacy) => pharmacy.id === pharmacyId);
  },

  // Toggle deal favorite status
  toggleDealFavorite: async (dealId) => {
    const isFavorite = get().isDealFavorite(dealId);

    if (isFavorite) {
      return await get().removeDealFromFavorites(dealId);
    } else {
      const result = await get().addDealToFavorites(dealId);
      // Refresh favorites to get complete data
      setTimeout(() => get().refreshFavorites(), 100);
      return result;
    }
  },

  // Toggle pharmacy favorite status
  togglePharmacyFavorite: async (pharmacyId) => {
    const isFavorite = get().isPharmacyFavorite(pharmacyId);

    if (isFavorite) {
      return await get().removePharmacyFromFavorites(pharmacyId);
    } else {
      const result = await get().addPharmacyToFavorites(pharmacyId);
      // Refresh favorites to get complete data
      setTimeout(() => get().refreshFavorites(), 100);
      return result;
    }
  },

  // Get total favorites count
  getTotalFavoritesCount: () => {
    const { favorites } = get();
    return favorites.deals.length + favorites.pharmacies.length;
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Force refresh favorites
  refreshFavorites: async () => {
    return await get().fetchFavorites(true);
  },

  // Reset favorites state
  resetFavorites: () => {
    set({
      favorites: {
        deals: [],
        pharmacies: [],
      },
      isLoading: false,
      error: null,
      isInitialized: false,
    });
  },
}));
