// Top navigation bar with responsive mobile menu

import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, TrendingUp, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/watchlist', label: 'Watchlist' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/alerts', label: 'Alerts' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout, loading } = useAuth();

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-crypto-accent/20 text-crypto-accent'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-crypto-border bg-crypto-dark/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-crypto-accent" />
          <span className="text-lg font-bold text-white">
            Crypto<span className="text-crypto-accent">Track</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {!loading && (
            isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-1.5">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4 text-slate-400" />
                  )}
                  <span className="max-w-[120px] truncate text-sm text-slate-300">
                    {user.name || user.email}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-crypto-accent px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                >
                  Sign up
                </Link>
              </div>
            )
          )}
        </div>

        <button
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

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
          <div className="mt-2 border-t border-crypto-border pt-2">
            {!loading && (
              isAuthenticated ? (
                <>
                  <p className="px-3 py-2 text-sm text-slate-400">
                    {user.name || user.email}
                  </p>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-800"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-1">
                  <NavLink
                    to="/login"
                    className={linkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign in
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className={linkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign up
                  </NavLink>
                </div>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  );
}