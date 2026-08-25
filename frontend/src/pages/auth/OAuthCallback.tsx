import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '@/lib/axios';

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('access_token');
    if (!token) { navigate('/login'); return; }

    api.get(`/api/auth/google/callback?access_token=${token}`)
      .then(({ data }) => {
        sessionStorage.setItem('token', data.jwt);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      })
      .catch(() => navigate('/login'));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}