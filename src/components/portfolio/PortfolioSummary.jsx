// Portfolio summary cards showing total value and P/L

import { Wallet, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { formatCurrency, formatPercent, getChangeColor } from '../../utils/formatters';
import StatCard from '../ui/StatCard';

/**
 * Summary stats for the user's portfolio
 */
export default function PortfolioSummary({ holdings, coins }) {
  const coinMap = Object.fromEntries(coins.map((c) => [c.id, c]));

  let totalValue = 0;
  let totalCost = 0;

  holdings.forEach((h) => {
    const coin = coinMap[h.coinId];
    const currentPrice = coin?.current_price || h.buyPrice;
    totalValue += h.quantity * currentPrice;
    totalCost += h.quantity * h.buyPrice;
  });

  const profitLoss = totalValue - totalCost;
  const growthPercent = totalCost > 0 ? ((profitLoss / totalCost) * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Value"
        value={formatCurrency(totalValue)}
        icon={Wallet}
      />
      <StatCard
        label="Total Cost"
        value={formatCurrency(totalCost)}
        icon={PieChart}
      />
      <StatCard
        label="Profit / Loss"
        value={formatCurrency(profitLoss)}
        subValue={formatPercent(growthPercent)}
        icon={profitLoss >= 0 ? TrendingUp : TrendingDown}
      />
      <StatCard
        label="Growth"
        value={
          <span className={getChangeColor(growthPercent)}>
            {formatPercent(growthPercent)}
          </span>
        }
        icon={growthPercent >= 0 ? TrendingUp : TrendingDown}
      />
    </div>
  );
}