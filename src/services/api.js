const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('cryptotrack_token');
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

export const api = {
  register: (email, password, name) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => request('/auth/me'),

  getUserData: () => request('/user/data'),

  saveUserData: (data) =>
    request('/user/data', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  migrateUserData: (data) =>
    request('/user/data/migrate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAuthConfig: () => request('/auth/config'),

  async startGoogleSignIn() {
    const config = await fetch(`${API_BASE}/auth/config`).then((r) => r.json());
    if (!config.googleEnabled) {
      throw new Error(
        'Google sign-in is not set up yet. Use email sign-in below, or add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to server/.env'
      );
    }
    window.location.href = `${API_BASE}/auth/google`;
  },
};