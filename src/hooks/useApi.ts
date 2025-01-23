import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';

interface ApiError {
  message: string;
  details?: Record<string, unknown>;
}

interface ApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  successMessage?: string;
  errorMessage?: string;
}

interface ApiResponse<T> {
  data: T;
  status: number;
}

export function useApi<T>({
  onSuccess,
  onError,
  successMessage,
  errorMessage
}: ApiOptions<T> = {}) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<AxiosError<ApiError> | null>(null);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      setData(response.data);
      
      if (successMessage) {
        enqueueSnackbar(successMessage, { variant: 'success' });
      }
      
      onSuccess?.(response.data);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(axiosError);
      const message = errorMessage || axiosError.response?.data?.message || 'Ocorreu um erro';
      enqueueSnackbar(message, { variant: 'error' });
      onError?.(axiosError.response?.data || { message });
      throw axiosError;
    } finally {
      setLoading(false);
    }
  }, [onSuccess, onError, successMessage, errorMessage, enqueueSnackbar]);

  return { data, error, loading, execute };
}