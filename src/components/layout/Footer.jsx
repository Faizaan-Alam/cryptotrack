// App footer with attribution

/**
 * Simple footer with data source attribution
 */
export default function Footer() {
  return (
    <footer className="border-t border-crypto-border py-6 text-center text-xs text-slate-500">
      <p>
        Data provided by{' '}
        <a
          href="https://www.coingecko.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-crypto-accent hover:underline"
        >
          CoinGecko
        </a>
        . Not financial advice.
      </p>
      <p className="mt-1">Built with React + Vite + Tailwind CSS</p>
    </footer>
  );
}