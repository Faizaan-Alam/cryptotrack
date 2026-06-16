// Search input for filtering coins by name or symbol

import { Search, X } from 'lucide-react';

/**
 * Search bar with clear button
 */
export default function SearchBar({ value, onChange, placeholder = 'Search coins...' }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-crypto-border bg-crypto-card py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 outline-none transition focus:border-crypto-accent focus:ring-1 focus:ring-crypto-accent"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}