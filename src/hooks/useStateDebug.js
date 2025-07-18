import { useEffect, useState } from 'react';
import { getStoreSizes, exportStoreData } from '../utils/stateManager';

/**
 * Hook for debugging state persistence
 * Only use in development mode
 */
export const useStateDebug = () => {
  const [storeSizes, setStoreSizes] = useState({});
  const [storeData, setStoreData] = useState({});

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV === 'development') {
      const updateDebugInfo = () => {
        setStoreSizes(getStoreSizes());
        setStoreData(exportStoreData());
      };

      // Update on mount
      updateDebugInfo();

      // Listen for storage changes
      const handleStorageChange = (e) => {
        if (e.key && e.key.includes('-storage')) {
          updateDebugInfo();
        }
      };

      window.addEventListener('storage', handleStorageChange);
      
      // Also listen for localStorage changes (for same-tab updates)
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);
        if (key.includes('-storage')) {
          updateDebugInfo();
        }
      };

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        localStorage.setItem = originalSetItem;
      };
    }
  }, []);

  const logStoreData = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Store Sizes:', storeSizes);
      console.log('Store Data:', storeData);
    }
  };

  const clearAllData = () => {
    localStorage.clear();
    setStoreSizes({});
    setStoreData({});
    console.log('All localStorage data cleared');
  };

  return {
    storeSizes,
    storeData,
    logStoreData,
    clearAllData,
  };
}; 