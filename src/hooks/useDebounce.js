import { useCallback, useRef, useEffect } from "react";
import debounce from "lodash.debounce";

/**
 * Custom hook for debounced search functionality
 * @param {Function} callback - The function to debounce
 * @param {number} delay - The delay in milliseconds (default: 500)
 * @returns {Function} - The debounced function
 */
export const useDebounce = (callback, delay = 500) => {
  const debouncedFnRef = useRef();

  useEffect(() => {
    debouncedFnRef.current = debounce(callback, delay);

    return () => {
      if (debouncedFnRef.current) {
        debouncedFnRef.current.cancel();
      }
    };
  }, [callback, delay]);

  const debouncedCallback = useCallback((...args) => {
    if (debouncedFnRef.current) {
      return debouncedFnRef.current(...args);
    }
  }, []);

  return debouncedCallback;
};
