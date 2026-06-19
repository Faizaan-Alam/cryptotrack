import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('No authentication token received');
      return;
    }

    loginWithToken(token)
      .then(() => navigate('/'))
      .catch(() => setError('Failed to complete sign in'));
  }, [searchParams, loginWithToken, navigate]);

  if (error) {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="text-crypto-loss">{error}</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 text-sm text-crypto-accent hover:underline"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md text-center">
      <p className="text-slate-400">Completing sign in...</p>
    </div>
  );
}