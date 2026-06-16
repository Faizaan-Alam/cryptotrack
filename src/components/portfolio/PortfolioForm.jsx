// Form to add new holdings to portfolio

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCrypto } from '../../context/CryptoContext';

/**
 * Form for adding a coin holding to the portfolio
 */
export default function PortfolioForm() {
  const { coins, addHolding } = useCrypto();
  const [coinId, setCoinId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const coin = coins.find((c) => c.id === coinId);
    if (!coin || !quantity || !buyPrice) return;

    addHolding(coin.id, coin.name, coin.symbol, quantity, buyPrice);
    setCoinId('');
    setQuantity('');
    setBuyPrice('');
  };

  // Auto-fill buy price when coin is selected
  const handleCoinChange = (id) => {
    setCoinId(id);
    const coin = coins.find((c) => c.id === id);
    if (coin) setBuyPrice(coin.current_price.toString());
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-crypto-border bg-crypto-card p-4">
      <h3 className="mb-4 text-sm font-semibold text-slate-300">Add Holding</h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <select
          value={coinId}
          onChange={(e) => handleCoinChange(e.target.value)}
          className="rounded-lg border border-crypto-border bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-crypto-accent"
          required
        >
          <option value="">Select coin...</option>
          {coins.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.symbol.toUpperCase()})
            </option>
          ))}
        </select>

        <input
          type="number"
          step="any"
          min="0"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="rounded-lg border border-crypto-border bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-crypto-accent"
          required
        />

        <input
          type="number"
          step="any"
          min="0"
          placeholder="Buy price ($)"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          className="rounded-lg border border-crypto-border bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-crypto-accent"
          required
        />

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-lg bg-crypto-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
    </form>
  );
}