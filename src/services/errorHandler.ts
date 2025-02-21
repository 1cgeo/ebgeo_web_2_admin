// Path: services\errorHandler.ts
import { AxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';

interface ApiError {
  message: string;
  details?: Record<string, string[]>;
}

export class ErrorHandler {
  static handle(error: Error | AxiosError) {
    if (this.isAxiosError(error)) {
      this.handleApiError(error);
    } else {
      this.handleGenericError(error);
    }
  }

  private static isAxiosError(error: unknown): error is AxiosError<ApiError> {
    return (error as AxiosError).isAxiosError === true;
  }

  private static handleApiError(error: AxiosError<ApiError>) {
    const status = error.response?.status;
    const data = error.response?.data;

    switch (status) {
      case 400:
        this.handleValidationError(data);
        break;
      case 401:
        this.handleUnauthorizedError();
        break;
      case 403:
        this.handleForbiddenError();
        break;
      case 404:
        this.handleNotFoundError();
        break;
      case 422:
        this.handleValidationError(data);
        break;
      case 500:
        this.handleServerError();
        break;
      default:
        this.handleUnknownError();
    }
  }

  private static handleValidationError(data?: ApiError) {
    if (data?.details) {
      const messages = Object.values(data.details).flat().join(', ');

      enqueueSnackbar(messages, {
        variant: 'error',
        autoHideDuration: 5000,
      });
    } else {
      enqueueSnackbar(data?.message || 'Dados inválidos', {
        variant: 'error',
      });
    }
  }

  private static handleUnauthorizedError() {
    enqueueSnackbar('Sessão expirada. Por favor, faça login novamente.', {
      variant: 'error',
    });
    // Redireciona para login se necessário
    window.location.href = '/login';
  }

  private static handleForbiddenError() {
    enqueueSnackbar('Você não tem permissão para realizar esta ação.', {
      variant: 'error',
    });
  }

  private static handleNotFoundError() {
    enqueueSnackbar('O recurso solicitado não foi encontrado.', {
      variant: 'error',
    });
  }

  private static handleServerError() {
    enqueueSnackbar(
      'Ocorreu um erro no servidor. Tente novamente mais tarde.',
      {
        variant: 'error',
      },
    );
  }

  private static handleUnknownError() {
    enqueueSnackbar('Ocorreu um erro inesperado. Tente novamente.', {
      variant: 'error',
    });
  }

  private static handleGenericError(error: Error) {
    console.error('Erro não tratado:', error);
    enqueueSnackbar('Ocorreu um erro inesperado.', {
      variant: 'error',
    });
  }
}
