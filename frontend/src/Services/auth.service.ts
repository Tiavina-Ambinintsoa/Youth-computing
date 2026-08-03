import { api } from '@/lib/axios';
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types/auth';

let _token: string | null = null;

async function fetchUserWithRole(jwt: string) {
  const { data } = await api.get('/api/profile/me', {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return data;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/api/auth/local', payload);
    _token = data.jwt;
    const fullUser = await fetchUserWithRole(data.jwt);
    sessionStorage.setItem('token', data.jwt);
    sessionStorage.setItem('user', JSON.stringify(fullUser));
    return { ...data, user: fullUser };
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/api/auth/local/register', payload);
    _token = data.jwt;
    const fullUser = await fetchUserWithRole(data.jwt);
    sessionStorage.setItem('token', data.jwt);
    sessionStorage.setItem('user', JSON.stringify(fullUser));
    return { ...data, user: fullUser };
  },

  logout() {
    _token = null;
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  },

  getToken(): string | null {
    return _token ?? sessionStorage.getItem('token');
  },

  restoreToken(token: string) {
    _token = token;
  },

  getUser(): AuthResponse['user'] | null {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
