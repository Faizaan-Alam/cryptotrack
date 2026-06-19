// Hook for managing price alerts with browser notifications

import { useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Manage price alerts — uses external state when provided, otherwise localStorage
 */
export function usePriceAlerts(coins = [], externalAlerts, externalSetAlerts) {
  const [localAlerts, setLocalAlerts] = useLocalStorage(STORAGE_KEYS.ALERTS, []);
  const alerts = externalAlerts ?? localAlerts;
  const setAlerts = externalSetAlerts ?? setLocalAlerts;

  const requestPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  const addAlert = useCallback(
    (coinId, coinName, targetPrice, condition = 'above') => {
      const newAlert = {
        id: `${coinId}-${Date.now()}`,
        coinId,
        coinName,
        targetPrice: parseFloat(targetPrice),
        condition,
        triggered: false,
        createdAt: Date.now(),
      };
      setAlerts((prev) => [...prev, newAlert]);
      requestPermission();
    },
    [setAlerts, requestPermission]
  );

  const removeAlert = useCallback(
    (alertId) => {
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    },
    [setAlerts]
  );

  useEffect(() => {
    if (!coins.length || !alerts.length) return;

    const coinMap = Object.fromEntries(coins.map((c) => [c.id, c]));

    alerts.forEach((alert) => {
      if (alert.triggered) return;

      const coin = coinMap[alert.coinId];
      if (!coin) return;

      const currentPrice = coin.current_price;
      const shouldTrigger =
        (alert.condition === 'above' && currentPrice >= alert.targetPrice) ||
        (alert.condition === 'below' && currentPrice <= alert.targetPrice);

      if (shouldTrigger) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`Price Alert: ${alert.coinName}`, {
            body: `${alert.coinName} is now $${currentPrice.toLocaleString()} (${alert.condition} $${alert.targetPrice})`,
            icon: coin.image,
          });
        }

        setAlerts((prev) =>
          prev.map((a) => (a.id === alert.id ? { ...a, triggered: true } : a))
        );
      }
    });
  }, [coins, alerts, setAlerts]);

  return { alerts, addAlert, removeAlert };
}