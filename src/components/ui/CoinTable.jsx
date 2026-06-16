// Full coin market data table

import CoinRow from './CoinRow';

/**
 * Responsive table showing cryptocurrency market data
 */
export default function CoinTable({ coins }) {
  if (!coins.length) {
    return (
      <div className="rounded-xl border border-crypto-border p-8 text-center text-slate-400">
        No coins match your search or filter criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-crypto-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-crypto-border text-xs uppercase tracking-wider text-slate-400">
            <th className="px-4 py-3 text-left">#</th>
            <th className="px-4 py-3 text-left">Coin</th>
            <th className="px-4 py-3 text-right hidden sm:table-cell">Price</th>
            <th className="px-4 py-3 text-right">24h %</th>
            <th className="px-4 py-3 text-right hidden md:table-cell">Market Cap</th>
            <th className="px-4 py-3 text-right hidden lg:table-cell">Volume</th>
            <th className="px-4 py-3 text-center">★</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, index) => (
            <CoinRow key={coin.id} coin={coin} rank={coin.market_cap_rank || index + 1} />
          ))}
        </tbody>
      </table>
    </div>
  );
}