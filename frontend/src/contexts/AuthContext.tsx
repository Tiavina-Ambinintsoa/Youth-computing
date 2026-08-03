// frontend/src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import type { User, LoginPayload, RegisterPayload } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('token');
    const savedUser = authService.getUser();
    if (savedToken && savedUser) {
      authService.restoreToken(savedToken);
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (payload: LoginPayload) => {
    const data = await authService.login(payload);
    setUser(data.user);
    toast.success(`Bienvenue, ${data.user.username} !`);
  };

  const register = async (payload: RegisterPayload) => {
    const data = await authService.register(payload);
    setUser(data.user);
    toast.success('Compte créé avec succès !');
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Déconnecté avec succès');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}