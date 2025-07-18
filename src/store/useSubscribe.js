import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import { subscribeToPlan } from "@/api/subscription";

export const useSubscribe = create(
  persist(
    (set) => ({
      loading: false,
      error: null,
      success: false,
      response: null,

      // subscribe action
      subscribe: async ({ userId, planName, planType, token }) => {
        set({ loading: true, error: null, success: false, response: null });
        try {
          let finalToken = token;
          if (!finalToken) {
            try {
              const user = JSON.parse(localStorage.getItem("user"));
              finalToken = user?.token;
            } catch { }
          }
          const res = await subscribeToPlan({
            userId,
            planName,
            planType,
            token: finalToken,
          });
          set({ loading: false, success: true, response: res });
          return res;
        } catch (err) {
          set({
            loading: false,
            error: err.message || "حدث خطأ أثناء الاشتراك",
            success: false,
          });
          throw err;
        }
      },

      // reset state if needed
      reset: () =>
        set({ loading: false, error: null, success: false, response: null }),
    }),
    {
      name: 'subscription-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields, exclude loading states and errors
        success: state.success,
        response: state.response,
      }),
    }
  )
);
