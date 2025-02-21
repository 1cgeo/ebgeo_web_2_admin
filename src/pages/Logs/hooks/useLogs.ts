// Path: pages\Logs\hooks\useLogs.ts
import { useCallback, useEffect, useState } from 'react';

import { logsService } from '@/services/logs';
import type { LogEntry, LogQueryParams } from '@/types/logs';

export function useLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<LogQueryParams>({
    limit: 100,
  });

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await logsService.query(filters);

      // Ordenar logs por timestamp decrescente
      const sortedLogs = [...response.logs].sort((a, b) => {
        const timeA = new Date(a.time || a.timestamp || 0).getTime();
        const timeB = new Date(b.time || b.timestamp || 0).getTime();
        return timeB - timeA;
      });

      setLogs(sortedLogs);
      setTotal(response.total);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (newFilters: Partial<LogQueryParams>) => {
    setFilters(current => ({
      ...current,
      ...newFilters,
    }));
  };

  return {
    logs,
    total,
    loading,
    error,
    filters,
    handleFilterChange,
    refresh: fetchLogs,
  };
}
