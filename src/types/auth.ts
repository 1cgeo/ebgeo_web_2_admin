// Path: types\auth.ts
import type { AuthUser } from '@/contexts/AuthContext';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}
