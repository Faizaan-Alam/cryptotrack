// Combines all context providers for the app

import { BrowserRouter } from 'react-router-dom';
import { CryptoProvider } from './CryptoContext';

export function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <CryptoProvider>{children}</CryptoProvider>
    </BrowserRouter>
  );
}