import { useSearchParams } from 'react-router-dom';

export function useQueryParams<T extends Record<string, string>>() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = Object.fromEntries(searchParams.entries()) as T;

  const setParams = (newParams: Partial<T>) => {
    const current = Object.fromEntries(searchParams.entries());
    setSearchParams({
      ...current,
      ...newParams
    });
  };

  const removeParam = (key: keyof T) => {
    searchParams.delete(String(key));
    setSearchParams(searchParams);
  };

  const clearParams = () => {
    setSearchParams({});
  };

  return {
    params,
    setParams,
    removeParam,
    clearParams
  };
}