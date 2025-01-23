import { AxiosError } from 'axios';
import { ErrorHandler } from '@/services/errorHandler';

export const handleApiError = async <T>(
  promise: Promise<T>
): Promise<[T | null, Error | null]> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    ErrorHandler.handle(error as Error | AxiosError);
    return [null, error as Error];
  }
};