import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);
const TOKEN_KEY = 'cryptotrack_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const setSession = useCallback((token, userData) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(userData);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .getMe()
      .then(({ user: userData }) => setUser(userData))
      .catch(() => clearSession())
      .finally(() => setLoading(false));
  }, [clearSession]);

  const register = useCallback(
    async (email, password, name) => {
      const { token, user: userData } = await api.register(email, password, name);
      setSession(token, userData);
      return userData;
    },
    [setSession]
  );

  const login = useCallback(
    async (email, password) => {
      const { token, user: userData } = await api.login(email, password);
      setSession(token, userData);
      return userData;
    },
    [setSession]
  );

  const loginWithToken = useCallback(
    (token) => {
      localStorage.setItem(TOKEN_KEY, token);
      return api.getMe().then(({ user: userData }) => {
        setUser(userData);
        return userData;
      });
    },
    []
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    loginWithToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}