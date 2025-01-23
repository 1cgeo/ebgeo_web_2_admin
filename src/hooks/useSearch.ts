import { useState, useCallback } from 'react';
import { useDebounce } from './useDebounce';

interface UseSearchOptions {
  delay?: number;
  minChars?: number;
}

export function useSearch({ delay = 500, minChars = 3 }: UseSearchOptions = {}) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, delay);

  const handleSearch = useCallback((
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(e.target.value);
  }, []);

  const resetSearch = useCallback(() => {
    setSearch('');
  }, []);

  return {
    search,
    debouncedSearch,
    handleSearch,
    resetSearch,
    isSearchValid: search.length >= minChars || search.length === 0
  };
}