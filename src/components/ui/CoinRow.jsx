// Single row in the coin market table

import { Link } from 'react-router-dom';
import { formatCurrency, formatCompact } from '../../utils/formatters';
import PriceChange from './PriceChange';
import WatchlistButton from './WatchlistButton';

/**
 * Table row displaying one cryptocurrency's market data
 */
export default function CoinRow({ coin, rank }) {
  return (
    <tr className="border-b border-crypto-border transition hover:bg-slate-800/50">
      <td className="px-4 py-3 text-slate-400">{rank}</td>
      <td className="px-4 py-3">
        <Link
          to={`/coin/${coin.id}`}
          className="flex items-center gap-3 hover:text-crypto-accent"
        >
          <img
            src={coin.image}
            alt={coin.name}
            className="h-8 w-8 rounded-full"
            loading="lazy"
          />
          <div>
            <span className="font-medium text-white">{coin.name}</span>
            <span className="ml-2 text-xs uppercase text-slate-400">
              {coin.symbol}
            </span>
          </div>
        </Link>
      </td>
      <td className="px-4 py-3 text-right font-medium hidden sm:table-cell">
        {formatCurrency(coin.current_price)}
      </td>
      <td className="px-4 py-3 text-right">
        <PriceChange value={coin.price_change_percentage_24h} />
      </td>
      <td className="px-4 py-3 text-right text-slate-300 hidden md:table-cell">
        {formatCompact(coin.market_cap)}
      </td>
      <td className="px-4 py-3 text-right text-slate-300 hidden lg:table-cell">
        {formatCompact(coin.total_volume)}
      </td>
      <td className="px-4 py-3 text-center">
        <WatchlistButton coinId={coin.id} />
      </td>
    </tr>
  );
}