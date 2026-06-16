// Empty state placeholder for pages with no data

/**
 * Shown when a list or section has no items
 */
export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-crypto-border p-12 text-center">
      {Icon && <Icon className="h-12 w-12 text-slate-500" />}
      <h3 className="text-lg font-semibold text-slate-300">{title}</h3>
      <p className="max-w-sm text-sm text-slate-500">{description}</p>
      {action}
    </div>
  );
}