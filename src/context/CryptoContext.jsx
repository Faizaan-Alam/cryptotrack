// Global state management via React Context API

import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useCoins } from '../hooks/useCoins';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { usePriceAlerts } from '../hooks/usePriceAlerts';
import { STORAGE_KEYS } from '../utils/constants';

const CryptoContext = createContext(null);

/**
 * Provider component wrapping the entire app with crypto state
 */
export function CryptoProvider({ children }) {
  const { coins, loading, error, refetch } = useCoins();
  const [watchlist, setWatchlist] = useLocalStorage(STORAGE_KEYS.WATCHLIST, []);
  const [portfolio, setPortfolio] = useLocalStorage(STORAGE_KEYS.PORTFOLIO, []);
  const { alerts, addAlert, removeAlert } = usePriceAlerts(coins);

  // Dashboard filter/sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('market_cap_desc');

  // Watchlist helpers
  const isInWatchlist = useCallback(
    (coinId) => watchlist.includes(coinId),
    [watchlist]
  );

  const toggleWatchlist = useCallback(
    (coinId) => {
      setWatchlist((prev) =>
        prev.includes(coinId)
          ? prev.filter((id) => id !== coinId)
          : [...prev, coinId]
      );
    },
    [setWatchlist]
  );

  // Portfolio helpers
  const addHolding = useCallback(
    (coinId, coinName, coinSymbol, quantity, buyPrice) => {
      setPortfolio((prev) => {
        const existing = prev.find((h) => h.coinId === coinId);
        if (existing) {
          return prev.map((h) =>
            h.coinId === coinId
              ? { ...h, quantity: h.quantity + quantity, buyPrice }
              : h
          );
        }
        return [
          ...prev,
          {
            coinId,
            coinName,
            coinSymbol,
            quantity: parseFloat(quantity),
            buyPrice: parseFloat(buyPrice),
            addedAt: Date.now(),
          },
        ];
      });
    },
    [setPortfolio]
  );

  const removeHolding = useCallback(
    (coinId) => {
      setPortfolio((prev) => prev.filter((h) => h.coinId !== coinId));
    },
    [setPortfolio]
  );

  // Filtered and sorted coins for dashboard
  const filteredCoins = useMemo(() => {
    let result = [...coins];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.symbol.toLowerCase().includes(q)
      );
    }

    // Gainers/losers filter
    if (filter === 'gainers') {
      result = result.filter((c) => c.price_change_percentage_24h > 0);
    } else if (filter === 'losers') {
      result = result.filter((c) => c.price_change_percentage_24h < 0);
    }

    // Sort
    const sortFns = {
      market_cap_desc: (a, b) => b.market_cap - a.market_cap,
      market_cap_asc: (a, b) => a.market_cap - b.market_cap,
      price_desc: (a, b) => b.current_price - a.current_price,
      price_asc: (a, b) => a.current_price - b.current_price,
      change_desc: (a, b) =>
        b.price_change_percentage_24h - a.price_change_percentage_24h,
      change_asc: (a, b) =>
        a.price_change_percentage_24h - b.price_change_percentage_24h,
      volume_desc: (a, b) => b.total_volume - a.total_volume,
      volume_asc: (a, b) => a.total_volume - b.total_volume,
    };

    result.sort(sortFns[sortBy] || sortFns.market_cap_desc);
    return result;
  }, [coins, searchQuery, filter, sortBy]);

  // Top gainers and losers (from full list, not filtered)
  const topGainers = useMemo(
    () =>
      [...coins]
        .filter((c) => c.price_change_percentage_24h > 0)
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        .slice(0, 5),
    [coins]
  );

  const topLosers = useMemo(
    () =>
      [...coins]
        .filter((c) => c.price_change_percentage_24h < 0)
        .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
        .slice(0, 5),
    [coins]
  );

  const value = {
    coins,
    filteredCoins,
    topGainers,
    topLosers,
    loading,
    error,
    refetch,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    watchlist,
    isInWatchlist,
    toggleWatchlist,
    portfolio,
    addHolding,
    removeHolding,
    alerts,
    addAlert,
    removeAlert,
  };

  return (
    <CryptoContext.Provider value={value}>{children}</CryptoContext.Provider>
  );
}

/**
 * Custom hook to consume crypto context
 */
export function useCrypto() {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
}