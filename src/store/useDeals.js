import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  createDeal,
  getDeals,
  getDeal,
  updateDeal,
  deleteDeal,
  updateDealStatus
} from '../api/deals';
import { getUserDeals } from '../api/profile/UserDeals';

export const useDeals = create(
  persist(
    (set, get) => ({
      deals: [],
      currentDeal: null,
      isLoading: false,
      isSubmitting: false,
      error: null,
      totalDeals: 0,
      currentPage: 1,
      totalPages: 1,

      // Create a new deal
      createDeal: async (dealData) => {
        set({ isSubmitting: true, error: null });

        try {
          const response = await createDeal(dealData);
          const newDeal = response.data.deal;

          set(state => ({
            deals: [newDeal, ...state.deals],
            isSubmitting: false,
            error: null,
            totalDeals: state.totalDeals + 1,
          }));

          return response;
        } catch (error) {
          set({
            isSubmitting: false,
            error: error.message || 'Failed to create deal',
          });
          throw error;
        }
      },

      // Fetch all deals
      fetchDeals: async (queryParams = {}) => {
        set({ isLoading: true, error: null });

        try {
          const response = await getDeals(queryParams);
          const { deals, total, page, totalPages } = response.data;

          set({
            deals: deals || [],
            totalDeals: total || 0,
            currentPage: page || 1,
            totalPages: totalPages || 1,
            isLoading: false,
            error: null,
          });

          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Failed to fetch deals',
          });
          throw error;
        }
      },

      fetchUserDeals: async (queryParams = {}) => {
        set({ isLoading: true, error: null });

        try {
          const response = await getUserDeals(queryParams);
          const { deals, total, page, totalPages } = response.data;

          set({
            deals: deals || [],
            totalDeals: total || 0,
            currentPage: page || 1,
            totalPages: totalPages || 1,
            isLoading: false,
            error: null,
          });

          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Failed to fetch user deals',
          });
          throw error;
        }
      },

      // Fetch a single deal
      fetchDeal: async (dealId) => {
        set({ isLoading: true, error: null });

        try {
          const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : undefined;
          const deal = await getDeal(dealId, token);
          set({
            currentDeal: deal,
            isLoading: false,
            error: null,
          });
          return deal;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Failed to fetch deal',
          });
          throw error;
        }
      },

      // Update a deal
      updateDeal: async (dealId, dealData) => {
        set({ isSubmitting: true, error: null });

        try {
          const response = await updateDeal(dealId, dealData);
          const updatedDeal = response.data.deal;

          set(state => ({
            deals: state.deals.map(deal =>
              deal.id === dealId ? updatedDeal : deal
            ),
            currentDeal: state.currentDeal?.id === dealId ? updatedDeal : state.currentDeal,
            isSubmitting: false,
            error: null,
          }));

          return response;
        } catch (error) {
          set({
            isSubmitting: false,
            error: error.message || 'Failed to update deal',
          });
          throw error;
        }
      },

      // Delete a deal
      deleteDeal: async (dealId) => {
        set({ isLoading: true, error: null });

        try {
          await deleteDeal(dealId);

          set(state => ({
            deals: state.deals.filter(deal => deal.id !== dealId),
            currentDeal: state.currentDeal?.id === dealId ? null : state.currentDeal,
            isLoading: false,
            error: null,
            totalDeals: state.totalDeals - 1,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Failed to delete deal',
          });
          throw error;
        }
      },

      // Update deal status
      updateDealStatus: async (dealId, isClosed) => {
        set({ isLoading: true, error: null });

        try {
          const response = await updateDealStatus(dealId, isClosed);
          const updatedDeal = response.data.deal;

          set(state => ({
            deals: state.deals.map(deal =>
              deal.id === dealId ? updatedDeal : deal
            ),
            currentDeal: state.currentDeal?.id === dealId ? updatedDeal : state.currentDeal,
            isLoading: false,
            error: null,
          }));

          return response;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Failed to update deal status',
          });
          throw error;
        }
      },

      // Set current deal
      setCurrentDeal: (deal) => {
        set({ currentDeal: deal });
      },

      // Clear current deal
      clearCurrentDeal: () => {
        set({ currentDeal: null });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Reset deals state
      resetDeals: () => {
        set({
          deals: [],
          currentDeal: null,
          isLoading: false,
          isSubmitting: false,
          error: null,
          totalDeals: 0,
          currentPage: 1,
          totalPages: 1,
        });
      },
    }),
    {
      name: 'deals-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields, exclude loading states and errors
        deals: state.deals,
        currentDeal: state.currentDeal,
        totalDeals: state.totalDeals,
        currentPage: state.currentPage,
        totalPages: state.totalPages,
      }),
    }
  )
); 