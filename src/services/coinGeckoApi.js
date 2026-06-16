// CoinGecko API service with caching and error handling

import { COINGECKO_BASE_URL, CACHE_TTL } from '../utils/constants';
import { getCache, setCache } from '../utils/cache';

/**
 * Generic fetch wrapper with caching and error handling
 * @param {string} endpoint - API endpoint path
 * @param {number} ttl - Cache TTL in ms
 */
async function fetchWithCache(endpoint, ttl) {
  const cacheKey = endpoint;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${COINGECKO_BASE_URL}${endpoint}`);

  if (!response.ok) {
    const error = new Error(`API Error: ${response.status} ${response.statusText}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  setCache(cacheKey, data, ttl);
  return data;
}

/**
 * Fetch top 100 cryptocurrencies by market cap
 */
export async function fetchTopCoins() {
  return fetchWithCache(
    '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h',
    CACHE_TTL.COINS
  );
}

/**
 * Fetch detailed info for a single coin
 * @param {string} coinId - CoinGecko coin ID (e.g., 'bitcoin')
 */
export async function fetchCoinDetail(coinId) {
  return fetchWithCache(
    `/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
    CACHE_TTL.COIN_DETAIL
  );
}

/**
 * Fetch price history for charting
 * @param {string} coinId - CoinGecko coin ID
 * @param {number} days - Number of days (7 or 30)
 */
export async function fetchCoinHistory(coinId, days) {
  return fetchWithCache(
    `/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
    CACHE_TTL.COIN_DETAIL
  );
}

/**
 * Fetch global crypto market statistics
 */
export async function fetchGlobalStats() {
  return fetchWithCache('/global', CACHE_TTL.GLOBAL);
}

/**
 * Fetch trending coins
 */
export async function fetchTrendingCoins() {
  return fetchWithCache('/search/trending', CACHE_TTL.TRENDING);
}

/**
 * Fetch Fear & Greed Index from alternative API
 * (CoinGecko doesn't provide this, so we use alternative.me)
 */
export async function fetchFearGreedIndex() {
  const cacheKey = 'fear_greed_index';
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const response = await fetch('https://api.alternative.me/fng/?limit=1');
  if (!response.ok) throw new Error('Failed to fetch Fear & Greed Index');

  const data = await response.json();
  setCache(cacheKey, data, CACHE_TTL.FEAR_GREED);
  return data;
}

/**
 * Search coins by query string
 * @param {string} query - Search term
 */
export async function searchCoins(query) {
  if (!query || query.length < 2) return { coins: [] };
  return fetchWithCache(
    `/search?query=${encodeURIComponent(query)}`,
    CACHE_TTL.COINS
  );
}

/**
 * Fetch current prices for multiple coin IDs (used for portfolio/watchlist)
 * @param {string[]} coinIds - Array of coin IDs
 */
export async function fetchCoinPrices(coinIds) {
  if (!coinIds.length) return {};
  const ids = coinIds.join(',');
  return fetchWithCache(
    `/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`,
    CACHE_TTL.COINS
  );
}