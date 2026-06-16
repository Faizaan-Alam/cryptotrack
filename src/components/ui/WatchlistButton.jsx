// Star button to add/remove coins from watchlist

import { Star } from 'lucide-react';
import { useCrypto } from '../../context/CryptoContext';

/**
 * Toggle watchlist star for a coin
 */
export default function WatchlistButton({ coinId, size = 'sm' }) {
  const { isInWatchlist, toggleWatchlist } = useCrypto();
  const active = isInWatchlist(coinId);

  const sizeClasses = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWatchlist(coinId);
      }}
      className="rounded p-1 transition hover:bg-slate-700"
      title={active ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <Star
        className={`${sizeClasses} ${
          active
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-slate-500 hover:text-yellow-400'
        }`}
      />
    </button>
  );
}