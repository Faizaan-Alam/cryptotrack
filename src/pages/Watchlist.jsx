// Watchlist page showing user's favorite coins

import { Star } from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';
import CoinTable from '../components/ui/CoinTable';
import EmptyState from '../components/ui/EmptyState';

/**
 * Watchlist page — displays coins the user has starred
 */
export default function Watchlist() {
  const { coins, watchlist } = useCrypto();

  const watchlistCoins = coins.filter((c) => watchlist.includes(c.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Watchlist</h1>
        <p className="text-sm text-slate-400">
          {watchlistCoins.length} coin{watchlistCoins.length !== 1 ? 's' : ''} tracked
        </p>
      </div>

      {watchlistCoins.length === 0 ? (
        <EmptyState
          icon={Star}
          title="Your watchlist is empty"
          description="Star coins on the dashboard to add them to your watchlist. Your favorites are saved locally in your browser."
        />
      ) : (
        <CoinTable coins={watchlistCoins} />
      )}
    </div>
  );
}