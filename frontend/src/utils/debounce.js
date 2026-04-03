/**
 * Debounce hook - delays function execution until after N milliseconds of inactivity
 * Prevents rapid repeated calls (e.g., from re-renders or user input)
 */

export function useDebounce(callback, delayMs = 500) {
  const timeoutRef = React.useRef(null);

  const debounced = React.useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delayMs);
  }, [callback, delayMs]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debounced;
}

/**
 * Throttle hook - executes function at most once per N milliseconds
 * Useful for polling/polling-like behavior
 */

export function useThrottle(callback, delayMs = 500) {
  const lastCallRef = React.useRef(0);

  const throttled = React.useCallback((...args) => {
    const now = Date.now();
    if (now - lastCallRef.current >= delayMs) {
      lastCallRef.current = now;
      callback(...args);
    }
  }, [callback, delayMs]);

  return throttled;
}

/**
 * Simple debounce function (non-hook version)
 * @param {Function} func - Function to debounce
 * @param {number} delayMs - Delay in milliseconds
 * @returns {Function} Debounced function
 */

export function debounce(func, delayMs = 500) {
  let timeoutId = null;

  return function debounced(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delayMs);
  };
}

/**
 * Simple throttle function (non-hook version)
 * @param {Function} func - Function to throttle
 * @param {number} delayMs - Delay in milliseconds between calls
 * @returns {Function} Throttled function
 */

export function throttle(func, delayMs = 500) {
  let lastCall = 0;

  return function throttled(...args) {
    const now = Date.now();
    if (now - lastCall >= delayMs) {
      lastCall = now;
      func(...args);
    }
  };
}
