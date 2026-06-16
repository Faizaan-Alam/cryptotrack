// Error display component with retry action

import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Display an error message with optional retry button
 */
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-red-500/30 bg-red-500/10 p-8 text-center">
      <AlertCircle className="h-10 w-10 text-crypto-loss" />
      <div>
        <h3 className="text-lg font-semibold text-red-400">Something went wrong</h3>
        <p className="mt-1 text-sm text-slate-400">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 rounded-lg bg-crypto-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );
}