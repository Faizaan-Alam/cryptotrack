// Tab-style filter buttons for gainers/losers/all

/**
 * Horizontal filter tabs
 */
export default function FilterTabs({ options, value, onChange }) {
  return (
    <div className="flex gap-1 rounded-lg border border-crypto-border bg-crypto-card p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
            value === option.value
              ? 'bg-crypto-accent text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}