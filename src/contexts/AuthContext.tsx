import { useState, type ReactNode } from 'react';
import api from '../services/api';
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from '../types/auth';
import { AuthContext } from './AuthContextDef';

export interface AuthContextType {
  user: User | null;
  signed: boolean;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('fintrack:user');
    const storedToken = localStorage.getItem('fintrack:token');

    if (storedUser && storedToken) {
      return JSON.parse(storedUser);
    }

    return null;
  });

  const [loading] = useState(false);

  async function login(data: LoginRequest) {
    const response = await api.post<AuthResponse>('/auth/login', data);
    const { user, token } = response.data;

    localStorage.setItem('fintrack:user', JSON.stringify(user));
    localStorage.setItem('fintrack:token', token);
    setUser(user);
  }

  async function register(data: RegisterRequest) {
    await api.post('/auth/register', data);
    await login({ email: data.email, password: data.password });
  }

  function logout() {
    localStorage.removeItem('fintrack:user');
    localStorage.removeItem('fintrack:token');
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, signed: !!user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
