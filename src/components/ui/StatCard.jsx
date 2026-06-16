// Reusable stat card for displaying key metrics

/**
 * Card component for showing a labeled statistic
 */
export default function StatCard({ label, value, subValue, icon: Icon }) {
  return (
    <div className="rounded-xl border border-crypto-border bg-crypto-card p-4 transition hover:border-crypto-accent/50">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </p>
        {Icon && <Icon className="h-4 w-4 text-crypto-accent" />}
      </div>
      <p className="mt-1 text-xl font-bold text-white">{value}</p>
      {subValue && (
        <p className="mt-0.5 text-xs text-slate-400">{subValue}</p>
      )}
    </div>
  );
}