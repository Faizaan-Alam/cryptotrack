// Price history chart using Recharts

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatCurrency, formatChartDate } from '../../utils/formatters';

/**
 * Custom tooltip for the price chart
 */
function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { price, date } = payload[0].payload;
  return (
    <div className="rounded-lg border border-crypto-border bg-crypto-card px-3 py-2 shadow-lg">
      <p className="text-xs text-slate-400">{formatChartDate(date)}</p>
      <p className="text-sm font-bold text-white">{formatCurrency(price)}</p>
    </div>
  );
}

/**
 * Area chart showing price history over time
 */
export default function PriceChart({ data, title, color = '#3b82f6' }) {
  // Transform raw price data into chart-friendly format
  const chartData = data.map(([timestamp, price]) => ({
    date: timestamp,
    price,
  }));

  // Determine if trend is positive for gradient color
  const isPositive =
    chartData.length >= 2 &&
    chartData[chartData.length - 1].price >= chartData[0].price;

  const trendColor = isPositive ? '#22c55e' : '#ef4444';
  const gradientId = `gradient-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="rounded-xl border border-crypto-border bg-crypto-card p-4">
      <h3 className="mb-4 text-sm font-semibold text-slate-300">{title}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={trendColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={trendColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="date"
            tickFormatter={formatChartDate}
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(2)}`}
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            width={60}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke={trendColor}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}