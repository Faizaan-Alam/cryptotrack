// Main app layout wrapper with header and footer

import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

/**
 * Page layout with consistent header, content area, and footer
 */
export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}