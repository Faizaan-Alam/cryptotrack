// Utility functions for formatting numbers, prices, and percentages

/**
 * Format a number as USD currency
 * @param {number} value - The value to format
 * @param {number} decimals - Number of decimal places
 */
export function formatCurrency(value, decimals = 2) {
  if (value == null || isNaN(value)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format large numbers with abbreviations (K, M, B, T)
 * @param {number} value - The value to format
 */
export function formatCompact(value) {
  if (value == null || isNaN(value)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a percentage with sign and color class
 * @param {number} value - The percentage value
 */
export function formatPercent(value) {
  if (value == null || isNaN(value)) return '0.00%';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Get Tailwind color class based on positive/negative value
 * @param {number} value - The value to check
 */
export function getChangeColor(value) {
  if (value > 0) return 'text-crypto-gain';
  if (value < 0) return 'text-crypto-loss';
  return 'text-slate-400';
}

/**
 * Format supply numbers with commas
 * @param {number} value - The supply value
 */
export function formatSupply(value) {
  if (value == null || isNaN(value)) return 'N/A';
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format date for chart tooltips
 * @param {string|number} timestamp - Unix timestamp or date string
 */
export function formatChartDate(timestamp) {
  const date = new Date(typeof timestamp === 'number' ? timestamp : timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Truncate long text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 */
export function truncateText(text, maxLength = 300) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}