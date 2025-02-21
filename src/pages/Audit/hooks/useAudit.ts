// Path: pages\Audit\hooks\useAudit.ts
import { useCallback, useEffect, useState } from 'react';

import { useDebounce } from '@/hooks/useDebounce';

import { auditService } from '@/services/audit';
import type { AuditAction, AuditEntry, AuditFilters } from '@/types/audit';

export function useAudit() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Filtros
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [selectedAction, setSelectedAction] = useState<AuditAction | ''>('');
  const [selectedActorId, setSelectedActorId] = useState<string>('');

  const debouncedSearch = useDebounce(search, 300);

  const fetchAuditEntries = useCallback(async () => {
    try {
      setLoading(true);

      const filters: AuditFilters = {
        page: page + 1,
        limit: rowsPerPage,
        search: debouncedSearch || undefined,
        action: selectedAction || undefined,
        actorId: selectedActorId || undefined,
        startDate: dateRange[0]?.toISOString(),
        endDate: dateRange[1]?.toISOString(),
      };

      const response = await auditService.query(filters);

      setEntries(response.entries);
      setTotalCount(response.total);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    rowsPerPage,
    debouncedSearch,
    selectedAction,
    selectedActorId,
    dateRange,
  ]);

  useEffect(() => {
    fetchAuditEntries();
  }, [fetchAuditEntries]);

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleDateRangeChange = (newRange: [Date | null, Date | null]) => {
    setDateRange(newRange);
    setPage(0);
  };

  const handleActionChange = (action: AuditAction | '') => {
    setSelectedAction(action);
    setPage(0);
  };

  const handleActorChange = (actorId: string) => {
    setSelectedActorId(actorId);
    setPage(0);
  };

  const clearFilters = () => {
    setSearch('');
    setDateRange([null, null]);
    setSelectedAction('');
    setSelectedActorId('');
    setPage(0);
  };

  return {
    entries,
    totalCount,
    page,
    rowsPerPage,
    loading,
    error,
    search,
    dateRange,
    selectedAction,
    selectedActorId,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearch,
    handleDateRangeChange,
    handleActionChange,
    handleActorChange,
    clearFilters,
    refetch: fetchAuditEntries,
  };
}
