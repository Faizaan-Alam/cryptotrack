// Portfolio tracker page

import { Trash2 } from 'lucide-react';
import { useCrypto } from '../context/CryptoContext';
import { formatCurrency, formatPercent, getChangeColor } from '../utils/formatters';
import PortfolioForm from '../components/portfolio/PortfolioForm';
import PortfolioSummary from '../components/portfolio/PortfolioSummary';
import EmptyState from '../components/ui/EmptyState';
import { Wallet } from 'lucide-react';

/**
 * Portfolio page — track holdings, value, and profit/loss
 */
export default function Portfolio() {
  const { coins, portfolio, removeHolding } = useCrypto();
  const coinMap = Object.fromEntries(coins.map((c) => [c.id, c]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Portfolio</h1>
        <p className="text-sm text-slate-400">Track your crypto holdings and performance</p>
      </div>

      <PortfolioForm />

      {portfolio.length > 0 && (
        <>
          <PortfolioSummary holdings={portfolio} coins={coins} />

          {/* Holdings table */}
          <div className="overflow-x-auto rounded-xl border border-crypto-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-crypto-border text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3 text-left">Coin</th>
                  <th className="px-4 py-3 text-right">Quantity</th>
                  <th className="px-4 py-3 text-right hidden sm:table-cell">Buy Price</th>
                  <th className="px-4 py-3 text-right">Current Price</th>
                  <th className="px-4 py-3 text-right">Value</th>
                  <th className="px-4 py-3 text-right">P/L</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((holding) => {
                  const coin = coinMap[holding.coinId];
                  const currentPrice = coin?.current_price || holding.buyPrice;
                  const value = holding.quantity * currentPrice;
                  const cost = holding.quantity * holding.buyPrice;
                  const pl = value - cost;
                  const plPercent = cost > 0 ? (pl / cost) * 100 : 0;

                  return (
                    <tr key={holding.coinId} className="border-b border-crypto-border hover:bg-slate-800/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {coin?.image && (
                            <img src={coin.image} alt="" className="h-6 w-6 rounded-full" loading="lazy" />
                          )}
                          <span className="font-medium text-white">{holding.coinName}</span>
                          <span className="text-xs uppercase text-slate-400">{holding.coinSymbol}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-300">{holding.quantity}</td>
                      <td className="px-4 py-3 text-right text-slate-300 hidden sm:table-cell">
                        {formatCurrency(holding.buyPrice)}
                      </td>
                      <td className="px-4 py-3 text-right text-white">
                        {formatCurrency(currentPrice)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-white">
                        {formatCurrency(value)}
                      </td>
                      <td className={`px-4 py-3 text-right font-medium ${getChangeColor(pl)}`}>
                        {formatCurrency(pl)}
                        <span className="block text-xs">{formatPercent(plPercent)}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => removeHolding(holding.coinId)}
                          className="rounded p-1 text-slate-400 transition hover:bg-red-500/20 hover:text-crypto-loss"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {portfolio.length === 0 && (
        <EmptyState
          icon={Wallet}
          title="No holdings yet"
          description="Add your first crypto holding above to start tracking your portfolio value and profit/loss."
        />
      )}
    </div>
  );
}