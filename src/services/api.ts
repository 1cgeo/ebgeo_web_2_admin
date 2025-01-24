import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { NetworkError } from './auth';

export class CSPError extends Error {
  constructor(directive: string) {
    super(`CSP violation: ${directive}`);
    this.name = 'CSPError';
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000
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
  }
);

// Response interceptor
api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// CSP violation handler
window.addEventListener('securitypolicyviolation', (e) => {
  throw new CSPError(e.violatedDirective);
});

export { NetworkError };