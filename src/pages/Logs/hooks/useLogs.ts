// src/pages/Logs/hooks/useLogs.ts

import { useState, useCallback, useEffect } from 'react';
import { logsService } from '@/services/logs';
import { useDebounce } from '@/hooks/useDebounce';
import type { LogEntry, LogQueryParams } from '@/types/logs';

export function useLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<LogQueryParams>({
    limit: 100
  });

  const debouncedSearch = useDebounce(search, 300);

  const fetchLogs = useCallback(async () => {
    if (debouncedSearch && debouncedSearch.length < 3) {
      return;
    }

    try {
      setLoading(true);
      const params: LogQueryParams = {
        ...filters,
        search: debouncedSearch || undefined
      };

      const response = await logsService.query(params);
      setLogs(response.logs);
      setTotal(response.total);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (value.length >= 3 || value.length === 0) {
      // Mantém consistente com outros módulos
      setFilters(current => ({ ...current }));
    }
  };

  const handleFilterChange = (newFilters: Partial<LogQueryParams>) => {
    setFilters(current => ({
      ...current,
      ...newFilters
    }));
  };

  return {
    logs,
    total,
    loading,
    error,
    search,
    filters,
    handleSearch,
    handleFilterChange,
    refresh: fetchLogs
  };
}