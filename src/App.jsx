// Root app component with lazy-loaded routes

import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { CoinTableSkeleton } from './components/ui/LoadingSkeleton';
import { CoinDetailSkeleton } from './components/ui/LoadingSkeleton';

// Lazy load pages for better performance (code splitting)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CoinDetails = lazy(() => import('./pages/CoinDetails'));
const Watchlist = lazy(() => import('./pages/Watchlist'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Alerts = lazy(() => import('./pages/Alerts'));

/**
 * Loading fallback for lazy-loaded pages
 */
function PageLoader({ type = 'table' }) {
  return type === 'detail' ? <CoinDetailSkeleton /> : <CoinTableSkeleton rows={10} />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="coin/:coinId"
          element={
            <Suspense fallback={<PageLoader type="detail" />}>
              <CoinDetails />
            </Suspense>
          }
        />
        <Route
          path="watchlist"
          element={
            <Suspense fallback={<PageLoader />}>
              <Watchlist />
            </Suspense>
          }
        />
        <Route
          path="portfolio"
          element={
            <Suspense fallback={<PageLoader />}>
              <Portfolio />
            </Suspense>
          }
        />
        <Route
          path="alerts"
          element={
            <Suspense fallback={<PageLoader />}>
              <Alerts />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}