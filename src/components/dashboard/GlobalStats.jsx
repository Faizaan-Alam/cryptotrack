// Global crypto market statistics banner

import { useState, useEffect } from 'react';
import { Globe, Bitcoin, BarChart3 } from 'lucide-react';
import { fetchGlobalStats } from '../../services/coinGeckoApi';
import { formatCompact, formatPercent } from '../../utils/formatters';
import StatCard from '../ui/StatCard';
import { StatCardSkeleton } from '../ui/LoadingSkeleton';

/**
 * Displays global market cap, BTC dominance, and 24h volume
 */
export default function GlobalStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlobalStats()
      .then((data) => setStats(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        label="Total Market Cap"
        value={formatCompact(stats.total_market_cap?.usd)}
        subValue={`${formatPercent(stats.market_cap_change_percentage_24h_usd)} 24h`}
        icon={Globe}
      />
      <StatCard
        label="BTC Dominance"
        value={`${stats.market_cap_percentage?.btc?.toFixed(1)}%`}
        icon={Bitcoin}
      />
      <StatCard
        label="24h Volume"
        value={formatCompact(stats.total_volume?.usd)}
        icon={BarChart3}
      />
    </div>
  );
}