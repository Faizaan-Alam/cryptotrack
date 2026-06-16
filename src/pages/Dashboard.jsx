// Main dashboard page with market overview

import { useCrypto } from '../context/CryptoContext';
import { SORT_OPTIONS, FILTER_OPTIONS } from '../utils/constants';
import GlobalStats from '../components/dashboard/GlobalStats';
import FearGreedIndex from '../components/dashboard/FearGreedIndex';
import TrendingCoins from '../components/dashboard/TrendingCoins';
import TopMovers from '../components/dashboard/TopMovers';
import SearchBar from '../components/ui/SearchBar';
import FilterTabs from '../components/ui/FilterTabs';
import CoinTable from '../components/ui/CoinTable';
import ErrorMessage from '../components/ui/ErrorMessage';
import { CoinTableSkeleton } from '../components/ui/LoadingSkeleton';

/**
 * Dashboard — top 100 coins, search, filter, sort, and market widgets
 */
export default function Dashboard() {
  const {
    filteredCoins,
    topGainers,
    topLosers,
    loading,
    error,
    refetch,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    sortBy,
    setSortBy,
  } = useCrypto();

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Market Dashboard</h1>
        <p className="text-sm text-slate-400">Top 100 cryptocurrencies by market cap</p>
      </div>

      {/* Global market stats */}
      <GlobalStats />

      {/* Sidebar widgets: Fear & Greed, Trending, Gainers, Losers */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <FearGreedIndex />
        <TrendingCoins />
        <TopMovers coins={topGainers} type="gainers" />
        <TopMovers coins={topLosers} type="losers" />
      </div>

      {/* Search, filter, and sort controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:max-w-xs">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <FilterTabs options={FILTER_OPTIONS} value={filter} onChange={setFilter} />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-crypto-border bg-crypto-card px-3 py-2 text-sm text-white outline-none focus:border-crypto-accent"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Coin table */}
      {error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : loading ? (
        <CoinTableSkeleton rows={15} />
      ) : (
        <CoinTable coins={filteredCoins} />
      )}
    </div>
  );
}