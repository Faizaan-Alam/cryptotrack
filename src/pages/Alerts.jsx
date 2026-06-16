// Price alerts management page

import { Bell, BellOff, Trash2 } from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';
import { formatCurrency } from '../utils/formatters';
import AlertForm from '../components/alerts/AlertForm';
import EmptyState from '../components/ui/EmptyState';

/**
 * Alerts page — create and manage price alerts
 */
export default function Alerts() {
  const { alerts, removeAlert, coins } = useCrypto();
  const coinMap = Object.fromEntries(coins.map((c) => [c.id, c]));

  const activeAlerts = alerts.filter((a) => !a.triggered);
  const triggeredAlerts = alerts.filter((a) => a.triggered);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Price Alerts</h1>
        <p className="text-sm text-slate-400">
          Get browser notifications when coins hit your target price
        </p>
      </div>

      <AlertForm />

      {/* Active alerts */}
      {activeAlerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-300">
            Active Alerts ({activeAlerts.length})
          </h2>
          {activeAlerts.map((alert) => {
            const coin = coinMap[alert.coinId];
            return (
              <div
                key={alert.id}
                className="flex items-center justify-between rounded-xl border border-crypto-border bg-crypto-card p-4"
              >
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-crypto-accent" />
                  <div>
                    <p className="font-medium text-white">{alert.coinName}</p>
                    <p className="text-xs text-slate-400">
                      Alert when price goes {alert.condition}{' '}
                      <span className="text-white">{formatCurrency(alert.targetPrice)}</span>
                      {coin && (
                        <span className="ml-2">
                          (current: {formatCurrency(coin.current_price)})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="rounded p-1 text-slate-400 transition hover:bg-red-500/20 hover:text-crypto-loss"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Triggered alerts */}
      {triggeredAlerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-500">
            Triggered ({triggeredAlerts.length})
          </h2>
          {triggeredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between rounded-xl border border-crypto-border/50 bg-crypto-card/50 p-4 opacity-60"
            >
              <div className="flex items-center gap-3">
                <BellOff className="h-5 w-5 text-slate-500" />
                <div>
                  <p className="font-medium text-slate-400">{alert.coinName}</p>
                  <p className="text-xs text-slate-500">
                    Triggered — {alert.condition} {formatCurrency(alert.targetPrice)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeAlert(alert.id)}
                className="rounded p-1 text-slate-500 hover:text-crypto-loss"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {alerts.length === 0 && (
        <EmptyState
          icon={Bell}
          title="No alerts set"
          description="Create a price alert above to get notified when a coin reaches your target price. Make sure to allow browser notifications."
        />
      )}
    </div>
  );
}