// Hook for fetching and managing coin market data

import { useState, useEffect, useCallback } from 'react';
import { fetchTopCoins } from '../services/coinGeckoApi';

/**
 * Fetch top 100 coins with loading/error states
 */
export function useCoins() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCoins = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTopCoins();
      setCoins(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch coins');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoins();
  }, [loadCoins]);

  return { coins, loading, error, refetch: loadCoins };
}