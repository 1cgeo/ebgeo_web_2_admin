// Path: hooks\useApi.ts
import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';

import { useCallback, useState } from 'react';

import type { NetworkErrorCode } from '@/services/api';
import { ApiError } from '@/services/api';

interface ApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  successMessage?: string;
  errorMessage?: string;
  showErrorSnackbar?: boolean;
  showSuccessSnackbar?: boolean;
}

interface ApiResponse<T> {
  data: T;
  status: number;
}

const DEFAULT_ERROR_MESSAGES: Record<NetworkErrorCode, string> = {
  TIMEOUT: 'A conexão expirou. Verifique sua internet e tente novamente.',
  DNS: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
  SSL: 'Erro de segurança na conexão. Verifique a data/hora do sistema.',
  NETWORK: 'Erro de conexão. Verifique sua internet e tente novamente.',
  AUTH: 'Sua sessão expirou. Por favor, faça login novamente.',
  CSP: 'Erro de segurança detectado. Contate o suporte.',
  SERVER_ERROR: 'Erro no servidor. Tente novamente mais tarde.',
  VALIDATION: 'Dados inválidos. Verifique as informações e tente novamente.',
  NOT_FOUND: 'O recurso solicitado não foi encontrado.',
};

export function useApi<T>({
  onSuccess,
  onError,
  successMessage,
  errorMessage,
  showErrorSnackbar = true,
  showSuccessSnackbar = true,
}: ApiOptions<T> = {}) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const execute = useCallback(
    async (apiCall: () => Promise<ApiResponse<T>>) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiCall();
        setData(response.data);

        if (showSuccessSnackbar && successMessage) {
          enqueueSnackbar(successMessage, { variant: 'success' });
        }

        onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        let apiError: ApiError;

        if (err instanceof ApiError) {
          apiError = err;
        } else if (err instanceof AxiosError) {
          apiError = new ApiError(
            err.response?.data?.message || 'Erro desconhecido',
            'NETWORK',
          );
        } else {
          apiError = new ApiError('Erro desconhecido', 'NETWORK');
        }

        setError(apiError);

        if (showErrorSnackbar) {
          const message =
            errorMessage ||
            apiError.message ||
            DEFAULT_ERROR_MESSAGES[apiError.code];

          enqueueSnackbar(message, {
            variant: 'error',
            autoHideDuration: 5000,
          });
        }

        onError?.(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [
      onSuccess,
      onError,
      successMessage,
      errorMessage,
      showErrorSnackbar,
      showSuccessSnackbar,
      enqueueSnackbar,
    ],
  );

  return { data, error, loading, execute };
}
