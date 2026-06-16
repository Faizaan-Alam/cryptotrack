// Fear & Greed Index indicator

import { useState, useEffect } from 'react';
import { Gauge } from 'lucide-react';
import { fetchFearGreedIndex } from '../../services/coinGeckoApi';
import { FEAR_GREED_LABELS } from '../../utils/constants';
import { SkeletonBar } from '../ui/LoadingSkeleton';

/**
 * Visual Fear & Greed Index meter
 */
export default function FearGreedIndex() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFearGreedIndex()
      .then((res) => setData(res.data?.[0]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-crypto-border bg-crypto-card p-4">
        <SkeletonBar className="h-4 w-32 mb-3" />
        <SkeletonBar className="h-8 w-full" />
      </div>
    );
  }

  if (!data) return null;

  const value = parseInt(data.value, 10);
  const label = FEAR_GREED_LABELS[Math.min(10, Math.floor(value / 10))] || data.value_classification;

  // Color based on value: red (fear) → yellow (neutral) → green (greed)
  const getColor = (v) => {
    if (v <= 25) return 'bg-crypto-loss';
    if (v <= 45) return 'bg-orange-500';
    if (v <= 55) return 'bg-yellow-500';
    if (v <= 75) return 'bg-lime-500';
    return 'bg-crypto-gain';
  };

  return (
    <div className="rounded-xl border border-crypto-border bg-crypto-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Gauge className="h-4 w-4 text-crypto-accent" />
        <h3 className="text-sm font-semibold text-slate-300">Fear & Greed Index</h3>
      </div>

      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className="mb-1 text-sm font-medium text-slate-400">{label}</span>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-700">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>

      <div className="mt-1 flex justify-between text-[10px] text-slate-500">
        <span>Extreme Fear</span>
        <span>Extreme Greed</span>
      </div>
    </div>
  );
}