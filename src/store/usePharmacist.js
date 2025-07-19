import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getPharmacistDetails } from '../api/profile/profile';

export const usePharmacist = create(
  persist(
    (set, get) => ({
      pharmacistDetails: null,
      isLoading: false,
      error: null,

      // Get pharmacist details action - stabilized to prevent recreation
      fetchPharmacistDetails: async (id, token) => {
        if (!id || !token) {
          set({ error: 'Missing user ID or authentication token', isLoading: false });
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
    }),
    {
      name: 'pharmacist-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields, exclude loading states and errors
        pharmacistDetails: state.pharmacistDetails,
      }),
    }
  )
); 