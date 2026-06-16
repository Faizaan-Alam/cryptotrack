// Reusable skeleton loading placeholders

/**
 * Single skeleton bar
 */
export function SkeletonBar({ className = '' }) {
  return <div className={`skeleton rounded ${className}`} />;
}

/**
 * Skeleton for a coin table row
 */
export function CoinRowSkeleton() {
  return (
    <tr className="border-b border-crypto-border">
      <td className="px-4 py-4"><SkeletonBar className="h-4 w-6" /></td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <SkeletonBar className="h-8 w-8 rounded-full" />
          <SkeletonBar className="h-4 w-24" />
        </div>
      </td>
      <td className="px-4 py-4 hidden sm:table-cell"><SkeletonBar className="h-4 w-20" /></td>
      <td className="px-4 py-4"><SkeletonBar className="h-4 w-16" /></td>
      <td className="px-4 py-4 hidden md:table-cell"><SkeletonBar className="h-4 w-20" /></td>
      <td className="px-4 py-4 hidden lg:table-cell"><SkeletonBar className="h-4 w-20" /></td>
      <td className="px-4 py-4"><SkeletonBar className="h-4 w-14" /></td>
    </tr>
  );
}

/**
 * Skeleton for the full coin table
 */
export function CoinTableSkeleton({ rows = 10 }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-crypto-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-crypto-border text-slate-400">
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
          {Array.from({ length: rows }).map((_, i) => (
            <CoinRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Skeleton for stat cards
 */
export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-crypto-border bg-crypto-card p-4">
      <SkeletonBar className="h-3 w-20 mb-2" />
      <SkeletonBar className="h-6 w-28" />
    </div>
  );
}

/**
 * Skeleton for coin detail page
 */
export function CoinDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <SkeletonBar className="h-16 w-16 rounded-full" />
        <div>
          <SkeletonBar className="h-8 w-48 mb-2" />
          <SkeletonBar className="h-4 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <SkeletonBar className="h-64 w-full rounded-xl" />
    </div>
  );
}