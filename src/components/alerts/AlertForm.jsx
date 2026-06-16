// Form to create new price alerts

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useCrypto } from '../../context/CryptoContext';

/**
 * Form for setting a price alert on a coin
 */
export default function AlertForm() {
  const { coins, addAlert } = useCrypto();
  const [coinId, setCoinId] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState('above');

  const handleSubmit = (e) => {
    e.preventDefault();
    const coin = coins.find((c) => c.id === coinId);
    if (!coin || !targetPrice) return;

    addAlert(coin.id, coin.name, targetPrice, condition);
    setCoinId('');
    setTargetPrice('');
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-crypto-border bg-crypto-card p-4">
      <h3 className="mb-4 text-sm font-semibold text-slate-300">Create Price Alert</h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <select
          value={coinId}
          onChange={(e) => setCoinId(e.target.value)}
          className="rounded-lg border border-crypto-border bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-crypto-accent"
          required
        >
          <option value="">Select coin...</option>
          {coins.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} — ${c.current_price?.toLocaleString()}
            </option>
          ))}
        </select>

        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="rounded-lg border border-crypto-border bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-crypto-accent"
        >
          <option value="above">Price goes above</option>
          <option value="below">Price goes below</option>
        </select>

        <input
          type="number"
          step="any"
          min="0"
          placeholder="Target price ($)"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          className="rounded-lg border border-crypto-border bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-crypto-accent"
          required
        />

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-lg bg-crypto-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
        >
          <Bell className="h-4 w-4" />
          Set Alert
        </button>
      </div>
    </form>
  );
}