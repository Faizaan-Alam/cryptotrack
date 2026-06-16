// Individual coin detail page with charts and stats

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useCoinDetail } from '../hooks/useCoinDetail';
import { formatCurrency, formatCompact, formatSupply, truncateText } from '../utils/formatters';
import PriceChange from '../components/ui/PriceChange';
import PriceChart from '../components/ui/PriceChart';
import StatCard from '../components/ui/StatCard';
import WatchlistButton from '../components/ui/WatchlistButton';
import ErrorMessage from '../components/ui/ErrorMessage';
import { CoinDetailSkeleton } from '../components/ui/LoadingSkeleton';

/**
 * Coin details page — price, stats, description, and charts
 */
export default function CoinDetails() {
  const { coinId } = useParams();
  const { coin, history7d, history30d, loading, error, refetch } = useCoinDetail(coinId);
  const [chartPeriod, setChartPeriod] = useState('7d');

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  if (loading || !coin) {
    return <CoinDetailSkeleton />;
  }

  const md = coin.market_data;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-slate-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Coin header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <img
            src={coin.image?.large}
            alt={coin.name}
            className="h-16 w-16 rounded-full"
          />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{coin.name}</h1>
              <WatchlistButton coinId={coin.id} size="lg" />
            </div>
            <p className="text-sm uppercase text-slate-400">
              {coin.symbol} · Rank #{md.market_cap_rank}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold text-white">
            {formatCurrency(md.current_price?.usd)}
          </p>
          <PriceChange value={md.price_change_percentage_24h} />
        </div>
      </div>

      {/* Key stats grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Market Cap" value={formatCompact(md.market_cap?.usd)} />
        <StatCard label="Circulating Supply" value={formatSupply(md.circulating_supply)} />
        <StatCard
          label="All Time High"
          value={formatCurrency(md.ath?.usd)}
          subValue={new Date(md.ath_date?.usd).toLocaleDateString()}
        />
        <StatCard
          label="All Time Low"
          value={formatCurrency(md.atl?.usd)}
          subValue={new Date(md.atl_date?.usd).toLocaleDateString()}
        />
      </div>

      {/* Price charts with period toggle */}
      <div>
        <div className="mb-3 flex gap-2">
          {['7d', '30d'].map((period) => (
            <button
              key={period}
              onClick={() => setChartPeriod(period)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                chartPeriod === period
                  ? 'bg-crypto-accent text-white'
                  : 'bg-crypto-card text-slate-400 hover:text-white'
              }`}
            >
              {period === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>

        <PriceChart
          data={chartPeriod === '7d' ? history7d : history30d}
          title={`${coin.name} Price — ${chartPeriod === '7d' ? '7 Day' : '30 Day'}`}
        />
      </div>

      {/* Description */}
      {coin.description?.en && (
        <div className="rounded-xl border border-crypto-border bg-crypto-card p-4">
          <h3 className="mb-2 text-sm font-semibold text-slate-300">About {coin.name}</h3>
          <p
            className="text-sm leading-relaxed text-slate-400"
            dangerouslySetInnerHTML={{
              __html: truncateText(
                coin.description.en.replace(/<a[^>]*>/g, '').replace(/<\/a>/g, ''),
                800
              ),
            }}
          />
          {coin.links?.homepage?.[0] && (
            <a
              href={coin.links.homepage[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm text-crypto-accent hover:underline"
            >
              Visit Website <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}