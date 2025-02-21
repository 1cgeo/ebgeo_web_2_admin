// Path: services\api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

interface ApiErrorResponse {
  message?: string;
  details?: Record<string, unknown>;
}

export class CSPError extends Error {
  constructor(directive: string) {
    super(`CSP violation: ${directive}`);
    this.name = 'CSPError';
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login');

    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    // Handle loss of admin privileges
    if (error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login?error=forbidden';
    }

    if (error.response?.status === 429) {
      localStorage.removeItem('token');
      window.location.href = '/login?error=ratelimit';
    }

    return Promise.reject(error);
  },
);

export const handleAuthError = (navigate: (path: string) => void) => {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');

  if (error === 'forbidden') {
    navigate('/login');
    return 'Sua sessão expirou devido a alterações nas suas permissões.';
  }

  if (error === 'ratelimit') {
    navigate('/login');
    return 'Limite de requisições excedido. Por favor, aguarde alguns minutos antes de tentar novamente.';
  }

  return null;
};

// CSP violation handler
window.addEventListener('securitypolicyviolation', e => {
  throw new CSPError(e.violatedDirective);
});
