// API and app-wide constants

export const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

// Cache TTL in milliseconds
export const CACHE_TTL = {
  COINS: 60 * 1000,        // 1 minute for market data
  COIN_DETAIL: 2 * 60 * 1000, // 2 minutes for coin details
  GLOBAL: 5 * 60 * 1000,   // 5 minutes for global stats
  TRENDING: 5 * 60 * 1000, // 5 minutes for trending
  FEAR_GREED: 30 * 60 * 1000, // 30 minutes for fear & greed
};

// Local storage keys
export const STORAGE_KEYS = {
  WATCHLIST: 'cryptotrack_watchlist',
  PORTFOLIO: 'cryptotrack_portfolio',
  ALERTS: 'cryptotrack_alerts',
};

// Sort options for the dashboard table
export const SORT_OPTIONS = [
  { value: 'market_cap_desc', label: 'Market Cap ↓' },
  { value: 'market_cap_asc', label: 'Market Cap ↑' },
  { value: 'price_desc', label: 'Price ↓' },
  { value: 'price_asc', label: 'Price ↑' },
  { value: 'change_desc', label: '24h Change ↓' },
  { value: 'change_asc', label: '24h Change ↑' },
  { value: 'volume_desc', label: 'Volume ↓' },
  { value: 'volume_asc', label: 'Volume ↑' },
];

// Filter options
export const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'gainers', label: 'Gainers' },
  { value: 'losers', label: 'Losers' },
];

// Fear & Greed index labels
export const FEAR_GREED_LABELS = {
  0: 'Extreme Fear',
  1: 'Extreme Fear',
  2: 'Fear',
  3: 'Fear',
  4: 'Fear',
  5: 'Neutral',
  6: 'Greed',
  7: 'Greed',
  8: 'Greed',
  9: 'Extreme Greed',
  10: 'Extreme Greed',
};