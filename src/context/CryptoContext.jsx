// Global state management via React Context API

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useCoins } from '../hooks/useCoins';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { usePriceAlerts } from '../hooks/usePriceAlerts';
import { useAuth } from './AuthContext';
import { api } from '../services/api';
import { STORAGE_KEYS } from '../utils/constants';

const CryptoContext = createContext(null);

function readLocalData() {
  try {
    return {
      watchlist: JSON.parse(localStorage.getItem(STORAGE_KEYS.WATCHLIST) || '[]'),
      portfolio: JSON.parse(localStorage.getItem(STORAGE_KEYS.PORTFOLIO) || '[]'),
      alerts: JSON.parse(localStorage.getItem(STORAGE_KEYS.ALERTS) || '[]'),
    };
  } catch {
    return { watchlist: [], portfolio: [], alerts: [] };
  }
}

export function CryptoProvider({ children }) {
  const { coins, loading, error, refetch } = useCoins();
  const { isAuthenticated, user, loading: authLoading } = useAuth();

  const [guestWatchlist, setGuestWatchlist] = useLocalStorage(STORAGE_KEYS.WATCHLIST, []);
  const [guestPortfolio, setGuestPortfolio] = useLocalStorage(STORAGE_KEYS.PORTFOLIO, []);

  const [watchlist, setWatchlist] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const skipSave = useRef(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('market_cap_desc');

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setWatchlist(guestWatchlist);
      setPortfolio(guestPortfolio);
      setAlerts(readLocalData().alerts);
      skipSave.current = true;
      return;
    }

    let cancelled = false;
    setUserDataLoading(true);
    skipSave.current = true;

    const localData = readLocalData();

    api
      .migrateUserData(localData)
      .catch(() => api.getUserData())
      .then((data) => {
        if (!cancelled) {
          setWatchlist(data.watchlist || []);
          setPortfolio(data.portfolio || []);
          setAlerts(data.alerts || []);
        }
      })
      .catch((err) => console.error('Failed to load user data:', err))
      .finally(() => {
        if (!cancelled) {
          setUserDataLoading(false);
          skipSave.current = false;
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user?.id, authLoading]);

  useEffect(() => {
    if (isAuthenticated || userDataLoading) return;
    setGuestWatchlist(watchlist);
  }, [watchlist, isAuthenticated, userDataLoading, setGuestWatchlist]);

  useEffect(() => {
    if (isAuthenticated || userDataLoading) return;
    setGuestPortfolio(portfolio);
  }, [portfolio, isAuthenticated, userDataLoading, setGuestPortfolio]);

  useEffect(() => {
    if (isAuthenticated || userDataLoading) return;
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  }, [alerts, isAuthenticated, userDataLoading]);

  useEffect(() => {
    if (!isAuthenticated || userDataLoading || skipSave.current) return;

    const timer = setTimeout(() => {
      api
        .saveUserData({ watchlist, portfolio, alerts })
        .catch((err) => console.error('Failed to save user data:', err));
    }, 600);

    return () => clearTimeout(timer);
  }, [watchlist, portfolio, alerts, isAuthenticated, userDataLoading]);

  const isInWatchlist = useCallback(
    (coinId) => watchlist.includes(coinId),
    [watchlist]
  );

  const toggleWatchlist = useCallback((coinId) => {
    setWatchlist((prev) =>
      prev.includes(coinId) ? prev.filter((id) => id !== coinId) : [...prev, coinId]
    );
  }, []);

  const addHolding = useCallback((coinId, coinName, coinSymbol, quantity, buyPrice) => {
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
  }, []);

  const removeHolding = useCallback((coinId) => {
    setPortfolio((prev) => prev.filter((h) => h.coinId !== coinId));
  }, []);

  const { addAlert, removeAlert } = usePriceAlerts(coins, alerts, setAlerts);

  const filteredCoins = useMemo(() => {
    let result = [...coins];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
      );
    }

    if (filter === 'gainers') {
      result = result.filter((c) => c.price_change_percentage_24h > 0);
    } else if (filter === 'losers') {
      result = result.filter((c) => c.price_change_percentage_24h < 0);
    }

    const sortFns = {
      market_cap_desc: (a, b) => b.market_cap - a.market_cap,
      market_cap_asc: (a, b) => a.market_cap - b.market_cap,
      price_desc: (a, b) => b.current_price - a.current_price,
      price_asc: (a, b) => a.current_price - b.current_price,
      change_desc: (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
      change_asc: (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h,
      volume_desc: (a, b) => b.total_volume - a.total_volume,
      volume_asc: (a, b) => a.total_volume - b.total_volume,
    };

    result.sort(sortFns[sortBy] || sortFns.market_cap_desc);
    return result;
  }, [coins, searchQuery, filter, sortBy]);

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
    userDataLoading,
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

  return <CryptoContext.Provider value={value}>{children}</CryptoContext.Provider>;
}

export function useCrypto() {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
}