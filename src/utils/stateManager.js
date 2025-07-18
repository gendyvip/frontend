// State management utilities for handling persistence and initialization

/**
 * Initialize all stores when the app loads
 * This ensures that persisted state is properly loaded
 */
export const initializeStores = () => {
    // The stores will automatically rehydrate from localStorage
    // when they are first accessed, thanks to the persist middleware

    console.log('Initializing stores...');

    // You can add any additional initialization logic here
    // For example, checking if user is authenticated and loading user-specific data

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
        console.log('User is authenticated, stores will rehydrate automatically');
    } else {
        console.log('No authentication found, clearing persisted state');
        clearAllStores();
    }
};

/**
 * Clear all persisted store data
 * Useful for logout or when you want to reset the application state
 */
export const clearAllStores = () => {
    const storeKeys = [
        'deals-storage',
        'favorites-storage',
        'pharmacies-storage',
        'chat-storage',
        'subscription-storage',
        'advertise-storage',
        'pharmacist-storage'
    ];

    storeKeys.forEach(key => {
        localStorage.removeItem(key);
    });

    console.log('All store data cleared');
};

/**
 * Get the size of all persisted store data
 * Useful for debugging storage usage
 */
export const getStoreSizes = () => {
    const storeKeys = [
        'deals-storage',
        'favorites-storage',
        'pharmacies-storage',
        'chat-storage',
        'subscription-storage',
        'advertise-storage',
        'pharmacist-storage'
    ];

    const sizes = {};

    storeKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
            sizes[key] = {
                size: new Blob([data]).size,
                sizeKB: (new Blob([data]).size / 1024).toFixed(2)
            };
        }
    });

    return sizes;
};

/**
 * Check if a store has data
 */
export const hasStoreData = (storeName) => {
    const data = localStorage.getItem(storeName);
    return data !== null;
};

/**
 * Export store data for debugging
 */
export const exportStoreData = () => {
    const storeKeys = [
        'deals-storage',
        'favorites-storage',
        'pharmacies-storage',
        'chat-storage',
        'subscription-storage',
        'advertise-storage',
        'pharmacist-storage'
    ];

    const data = {};

    storeKeys.forEach(key => {
        const storeData = localStorage.getItem(key);
        if (storeData) {
            try {
                data[key] = JSON.parse(storeData);
            } catch (error) {
                data[key] = storeData;
            }
        }
    });

    return data;
}; 