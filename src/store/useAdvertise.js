import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAdvertise = create(
    persist(
        (set) => ({
            advertise: null,
            setAdvertise: (values) => set({ advertise: values }),
        }),
        {
            name: 'advertise-storage', // unique name for localStorage key
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                // Only persist the advertise data
                advertise: state.advertise,
            }),
        }
    )
);