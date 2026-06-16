// Reusable component for top gainers or losers

import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import PriceChange from '../ui/PriceChange';

/**
 * Shows top 5 gainers or losers
 */
export default function TopMovers({ coins, type = 'gainers' }) {
  const isGainers = type === 'gainers';
  const Icon = isGainers ? TrendingUp : TrendingDown;
  const title = isGainers ? 'Top Gainers' : 'Top Losers';
  const iconColor = isGainers ? 'text-crypto-gain' : 'text-crypto-loss';

  if (!coins.length) return null;

  return (
    <div className="rounded-xl border border-crypto-border bg-crypto-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${iconColor}`} />
        <h3 className="text-sm font-semibold text-slate-300">{title}</h3>
      </div>

      <div className="space-y-2">
        {coins.map((coin) => (
          <Link
            key={coin.id}
            to={`/coin/${coin.id}`}
            className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-slate-700/50"
          >
            <img
              src={coin.image}
              alt={coin.name}
              className="h-6 w-6 rounded-full"
              loading="lazy"
            />
            <span className="flex-1 text-sm font-medium text-white truncate">
              {coin.name}
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">
              {formatCurrency(coin.current_price)}
            </span>
            <PriceChange value={coin.price_change_percentage_24h} showIcon={false} />
          </Link>
        ))}
      </div>
    </div>
  );
}