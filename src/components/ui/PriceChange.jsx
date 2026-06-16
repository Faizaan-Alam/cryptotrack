// Displays price change percentage with color coding

import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPercent, getChangeColor } from '../../utils/formatters';

/**
 * Renders a 24h price change with green/red color and arrow icon
 */
export default function PriceChange({ value, showIcon = true }) {
  const colorClass = getChangeColor(value);
  const isPositive = value > 0;

  return (
    <span className={`inline-flex items-center gap-1 font-medium ${colorClass}`}>
      {showIcon && (
        isPositive
          ? <TrendingUp className="h-3.5 w-3.5" />
          : <TrendingDown className="h-3.5 w-3.5" />
      )}
      {formatPercent(value)}
    </span>
  );
}