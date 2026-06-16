// Trending coins section

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { fetchTrendingCoins } from '../../services/coinGeckoApi';
import { SkeletonBar } from '../ui/LoadingSkeleton';

/**
 * Shows top 5 trending coins from CoinGecko
 */
export default function TrendingCoins() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingCoins()
      .then((data) => setTrending(data.coins?.slice(0, 5) || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-crypto-border bg-crypto-card p-4">
        <SkeletonBar className="h-4 w-32 mb-3" />
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBar key={i} className="h-8 w-full mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-crypto-border bg-crypto-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Flame className="h-4 w-4 text-orange-400" />
        <h3 className="text-sm font-semibold text-slate-300">Trending</h3>
      </div>

      <div className="space-y-2">
        {trending.map((item, i) => (
          <Link
            key={item.item.id}
            to={`/coin/${item.item.id}`}
            className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-slate-700/50"
          >
            <span className="w-4 text-xs text-slate-500">{i + 1}</span>
            <img
              src={item.item.small}
              alt={item.item.name}
              className="h-6 w-6 rounded-full"
              loading="lazy"
            />
            <span className="flex-1 text-sm font-medium text-white">
              {item.item.name}
            </span>
            <span className="text-xs uppercase text-slate-400">
              {item.item.symbol}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}