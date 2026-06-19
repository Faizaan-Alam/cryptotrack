// Combines all context providers for the app

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { CryptoProvider } from './CryptoContext';

export function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CryptoProvider>{children}</CryptoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}