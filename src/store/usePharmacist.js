import { create } from 'zustand';
import { getPharmacistDetails } from '../api/profile/profile';

export const usePharmacist = create((set, get) => ({
  pharmacistDetails: null,
  isLoading: false,
  error: null,

  // Get pharmacist details action - stabilized to prevent recreation
  fetchPharmacistDetails: async (id, token) => {
    if (!token) {
      set({ error: 'No authentication token available', isLoading: false });
      return;
    }

    // Prevent multiple simultaneous calls
    if (get().isLoading) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await getPharmacistDetails(id, token);

      set({
        pharmacistDetails: response.data || response,
        isLoading: false,
        error: null,
      });

      return response;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch pharmacist details',
      });
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Reset pharmacist state
  resetPharmacist: () => {
    set({
      pharmacistDetails: null,
      isLoading: false,
      error: null,
    });
  },
})); 