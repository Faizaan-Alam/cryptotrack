// Simple in-memory cache with TTL support for API responses

const cache = new Map();

/**
 * Get cached data if it exists and hasn't expired
 * @param {string} key - Cache key
 * @returns {any|null} Cached data or null if expired/missing
 */
export function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

/**
 * Store data in cache with TTL
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttl - Time to live in milliseconds
 */
export function setCache(key, data, ttl) {
  cache.set(key, {
    data,
    expiry: Date.now() + ttl,
  });
}

/**
 * Clear all cached entries
 */
export function clearCache() {
  cache.clear();
}

/**
 * Remove a specific cache entry
 * @param {string} key - Cache key to remove
 */
export function removeCache(key) {
  cache.delete(key);
}