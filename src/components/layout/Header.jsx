// Top navigation bar with responsive mobile menu

import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, TrendingUp } from 'lucide-react';

const NAV_LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/watchlist', label: 'Watchlist' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/alerts', label: 'Alerts' },
];

/**
 * App header with navigation links
 */
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-crypto-accent/20 text-crypto-accent'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-crypto-border bg-crypto-dark/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-crypto-accent" />
          <span className="text-lg font-bold text-white">
            Crypto<span className="text-crypto-accent">Track</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <nav className="border-t border-crypto-border px-4 py-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              end={link.to === '/'}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}