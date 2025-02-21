// Path: services\api.ts
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

interface ApiErrorResponse {
  message?: string;
  details?: Record<string, unknown>;
}

export type NetworkErrorCode =
  | 'TIMEOUT'
  | 'DNS'
  | 'SSL'
  | 'NETWORK'
  | 'AUTH'
  | 'CSP'
  | 'SERVER_ERROR'
  | 'VALIDATION'
  | 'NOT_FOUND';

export class ApiError extends Error {
  constructor(
    message: string,
    public code: NetworkErrorCode,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
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

// Response interceptor
api.interceptors.response.use(
  response => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    // Handle connection/network errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        throw new ApiError('Tempo limite de conexão excedido', 'TIMEOUT');
      }
      if (error.code === 'ERR_NAME_NOT_RESOLVED') {
        throw new ApiError('Erro de resolução DNS', 'DNS');
      }
      if (error.code === 'CERT_HAS_EXPIRED') {
        throw new ApiError('Erro de certificado SSL', 'SSL');
      }
      throw new ApiError('Erro de conexão com o servidor', 'NETWORK');
    }

    const status = error.response.status;
    const data = error.response.data;
    const isLoginRequest = error.config?.url?.includes('/auth/login');

    // Authentication errors
    if (status === 401 && !isLoginRequest) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new ApiError('Sessão expirada', 'AUTH');
    }

    // Authorization errors
    if (status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login?error=forbidden';
      throw new ApiError('Acesso negado', 'AUTH');
    }

    // Rate limiting
    if (status === 429) {
      window.location.href = '/login?error=ratelimit';
      throw new ApiError('Limite de requisições excedido', 'AUTH');
    }

    // Validation errors
    if (status === 422 || status === 400) {
      const message = data?.details
        ? Object.values(data.details).flat().join(', ')
        : data?.message || 'Erro de validação';
      throw new ApiError(message, 'VALIDATION', data?.details);
    }

    // Not found
    if (status === 404) {
      throw new ApiError(
        data?.message || 'Recurso não encontrado',
        'NOT_FOUND',
      );
    }

    // Server errors
    if (status >= 500) {
      throw new ApiError(
        'Erro interno do servidor. Tente novamente mais tarde.',
        'SERVER_ERROR',
      );
    }

    // Generic errors
    throw new ApiError(
      data?.message || 'Ocorreu um erro inesperado',
      'NETWORK',
    );
  },
);

// Helper function to extract error message from login errors
export const handleAuthError = (navigate: (path: string) => void) => {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');

  if (error === 'forbidden') {
    navigate('/login');
    return 'Sua sessão expirou devido a alterações nas suas permissões.';
  }

  if (error === 'ratelimit') {
    navigate('/login');
    return 'Limite de requisições excedido. Por favor, aguarde alguns minutos.';
  }

  return null;
};

// CSP violation handler
window.addEventListener('securitypolicyviolation', e => {
  throw new CSPError(e.violatedDirective);
});
