/**
 * Request cache with TTL (Time To Live)
 * Stores API responses and returns cached data if not expired
 * Prevents redundant requests to the same endpoint within TTL window
 */

class RequestCache {
  constructor(ttlMs = 5000) {
    this.cache = new Map();
    this.ttlMs = ttlMs;
    this.pending = new Map(); // Track in-flight requests
  }

  /**
   * Get cached response or execute fetch function
   * @param {string} key - Cache key (usually the API endpoint)
   * @param {Function} fetchFn - Async function to fetch data
   * @returns {Promise} Response data
   */
  async get(key, fetchFn) {
    // Return cached data if still valid
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.ttlMs) {
      return cached.data;
    }

    // Return pending request if one is in flight
    if (this.pending.has(key)) {
      return this.pending.get(key);
    }

    // Start new request and store promise
    const promise = fetchFn();
    this.pending.set(key, promise);

    try {
      const data = await promise;
      // Cache successful response
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
      });
      return data;
    } finally {
      this.pending.delete(key);
    }
  }

  /**
   * Invalidate cache for a specific key
   */
  invalidate(key) {
    this.cache.delete(key);
  }

  /**
   * Clear entire cache
   */
  clear() {
    this.cache.clear();
    this.pending.clear();
  }

  /**
   * Set cache TTL (milliseconds)
   */
  setTTL(ttlMs) {
    this.ttlMs = ttlMs;
  }
}

// Default cache instance for API responses
const defaultCache = new RequestCache(5000); // 5 second TTL

export { RequestCache, defaultCache };
