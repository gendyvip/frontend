import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getPharmacies, createPharmacy, updatePharmacy, deletePharmacy } from '../api/profile/UserPharmacy';

export const usePharmacies = create(
  persist(
    (set, get) => ({
      pharmacies: [],
      isLoading: false,
      error: null,
      selectedPharmacy: null,

      // Get user pharmacies
      fetchPharmacies: async (token, user) => {
        if (!token || !user) {
          throw new Error('Token and user are required');
        }

        set({ isLoading: true, error: null });
        
        try {
          const response = await getPharmacies(token, user);
          const pharmaciesArray = Array.isArray(response.data.pharmacies) ? response.data.pharmacies : (Array.isArray(response) ? response : []);
          set({
            pharmacies: pharmaciesArray,
            isLoading: false,
            error: null,
          });
          console.log(pharmaciesArray)
          return response.data.pharmacies;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Failed to fetch pharmacies',
          });
          throw error;
        }
      },

      // Create new pharmacy
      addPharmacy: async (pharmacyData, token) => {
        if (!token) {
          throw new Error('Token is required');
        }

        set({ isLoading: true, error: null });
        
        try {
          const response = await createPharmacy(pharmacyData, token);
          const newPharmacy = response.data || response;
          set(state => ({
            pharmacies: Array.isArray(state.pharmacies) ? [...state.pharmacies, newPharmacy] : [newPharmacy],
            isLoading: false,
            error: null,
          }));
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Failed to create pharmacy',
          });
          throw error;
        }
      },

      // Update pharmacy
      updatePharmacyById: async (pharmacyId, pharmacyData, token) => {
        if (!token) {
          throw new Error('Token is required');
        }

        set({ isLoading: true, error: null });
        
        try {
          const response = await updatePharmacy(pharmacyId, pharmacyData, token);
          const updatedPharmacy = response.data || response;
          set(state => ({
            pharmacies: Array.isArray(state.pharmacies)
              ? state.pharmacies.map(pharmacy => pharmacy.id === pharmacyId ? updatedPharmacy : pharmacy)
              : [],
            isLoading: false,
            error: null,
          }));
          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Failed to update pharmacy',
          });
          throw error;
        }
      },

      // Delete pharmacy
      deletePharmacyById: async (pharmacyId, token) => {
        if (!token) {
          throw new Error('Token is required');
        }

        set({ isLoading: true, error: null });
        
        try {
          await deletePharmacy(pharmacyId, token);
          set(state => ({
            pharmacies: Array.isArray(state.pharmacies)
              ? state.pharmacies.filter(pharmacy => pharmacy.id !== pharmacyId)
              : [],
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Failed to delete pharmacy',
          });
          throw error;
        }
      },

      // Set selected pharmacy
      setSelectedPharmacy: (pharmacy) => {
        set({ selectedPharmacy: pharmacy });
      },

      // Clear selected pharmacy
      clearSelectedPharmacy: () => {
        set({ selectedPharmacy: null });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Reset pharmacies state
      resetPharmacies: () => {
        set({
          pharmacies: [],
          isLoading: false,
          error: null,
          selectedPharmacy: null,
        });
      },
    }),
    {
      name: 'pharmacies-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields, exclude loading states and errors
        pharmacies: state.pharmacies,
        selectedPharmacy: state.selectedPharmacy,
      }),
    }
  )
);
