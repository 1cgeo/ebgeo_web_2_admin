// Path: services\auth.ts
import type { AxiosError } from 'axios';
import axios from 'axios';

import type { LoginCredentials, LoginResponse } from '@/types/auth';

import { api } from './api';

const TIMEOUT = 15000;

export class NetworkError extends Error {
  constructor(
    message: string,
    public code: NetworkErrorCode,
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

export type NetworkErrorCode =
  | 'TIMEOUT'
  | 'DNS'
  | 'SSL'
  | 'NETWORK'
  | 'AUTH'
  | 'CSP';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>(
        '/api/auth/login',
        credentials,
        {
          timeout: TIMEOUT,
        },
      );
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (!axiosError.response) {
          if (axiosError.code === 'ECONNABORTED') {
            throw new NetworkError('Connection timeout', 'TIMEOUT');
          }
          if (axiosError.code === 'ERR_NAME_NOT_RESOLVED') {
            throw new NetworkError('DNS resolution failed', 'DNS');
          }
          if (axiosError.code === 'CERT_HAS_EXPIRED') {
            throw new NetworkError('SSL certificate error', 'SSL');
          }
          throw new NetworkError('Server unavailable', 'NETWORK');
        }

        if (axiosError.response.status === 401) {
          localStorage.removeItem('token');
          throw new NetworkError('Invalid or expired token', 'AUTH');
        }
      }
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout');
    } finally {
      localStorage.removeItem('token');
    }
  },

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem('token'));
  },
};
