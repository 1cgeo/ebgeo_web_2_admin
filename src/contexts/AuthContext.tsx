// Path: contexts\AuthContext.tsx
import { createContext } from 'react';

// Tipo específico para o usuário no contexto de autenticação
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  nome_completo?: string;
  nome_guerra?: string;
  organizacao_militar?: string;
}

export interface AuthContextData {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const AuthContext = createContext<AuthContextData | undefined>(
  undefined,
);
