// Root app component with lazy-loaded routes

import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { CoinTableSkeleton } from './components/ui/LoadingSkeleton';
import { CoinDetailSkeleton } from './components/ui/LoadingSkeleton';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const CoinDetails = lazy(() => import('./pages/CoinDetails'));
const Watchlist = lazy(() => import('./pages/Watchlist'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Alerts = lazy(() => import('./pages/Alerts'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));

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
              <ProtectedRoute>
                <Watchlist />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="portfolio"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="alerts"
          element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute>
                <Alerts />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="login"
          element={
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="signup"
          element={
            <Suspense fallback={<PageLoader />}>
              <SignUp />
            </Suspense>
          }
        />
        <Route
          path="auth/callback"
          element={
            <Suspense fallback={<PageLoader />}>
              <AuthCallback />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}