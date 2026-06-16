// Hook for fetching individual coin details and price history

import { useState, useEffect, useCallback } from 'react';
import { fetchCoinDetail, fetchCoinHistory } from '../services/coinGeckoApi';

/**
 * Fetch coin detail and price history for charts
 * @param {string} coinId - CoinGecko coin ID
 */
export function useCoinDetail(coinId) {
  const [coin, setCoin] = useState(null);
  const [history7d, setHistory7d] = useState([]);
  const [history30d, setHistory30d] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCoin = useCallback(async () => {
    if (!coinId) return;
    try {
      setLoading(true);
      setError(null);

      const [detail, hist7, hist30] = await Promise.all([
        fetchCoinDetail(coinId),
        fetchCoinHistory(coinId, 7),
        fetchCoinHistory(coinId, 30),
      ]);

      setCoin(detail);
      setHistory7d(hist7.prices || []);
      setHistory30d(hist30.prices || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch coin details');
    } finally {
      setLoading(false);
    }
  }, [coinId]);

  useEffect(() => {
    loadCoin();
  }, [loadCoin]);

  return { coin, history7d, history30d, loading, error, refetch: loadCoin };
}