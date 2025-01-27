import { useState, useCallback, useEffect } from 'react';
import { zonesService } from '@/services/zones';
import { useDebounce } from '@/hooks/useDebounce';
import type { 
  ZoneWithStats, 
  ZoneListParams, 
  CreateZoneRequest, 
  UpdateZonePermissionsRequest 
} from '@/types/geographic';

type SortableFields = 'name' | 'created_at' | 'area_km2' | 'user_count' | 'group_count';

export function useZones() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [zones, setZones] = useState<ZoneWithStats[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortableFields>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const debouncedSearch = useDebounce(search, 300);

  const fetchZones = useCallback(async () => {
    if (debouncedSearch && debouncedSearch.length < 3) {
      return;
    }

    try {
      setLoading(true);
      const params: ZoneListParams = {
        page: page + 1,
        limit: rowsPerPage,
        search: debouncedSearch || undefined,
        sort: sortField,
        order: sortOrder
      };

      const response = await zonesService.list(params);

      setZones(response.zones);
      setTotalCount(response.total);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, debouncedSearch, sortField, sortOrder]);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    if (value.length >= 3 || value.length === 0) {
      setPage(0);
    }
  };

  const handleSort = (field: SortableFields) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const createZone = async (data: CreateZoneRequest) => {
    return zonesService.create(data);
  };

  const deleteZone = async (id: string) => {
    return zonesService.delete(id);
  };

  const getZoneDetails = async (id: string) => {
    return zonesService.getDetails(id);
  };

  const getZonePermissions = async (id: string) => {
    return zonesService.getPermissions(id);
  };

  const updateZonePermissions = async (id: string, data: UpdateZonePermissionsRequest) => {
    return zonesService.updatePermissions(id, data);
  };

  return {
    zones,
    totalCount,
    page,
    rowsPerPage,
    loading,
    error,
    search,
    sortField,
    sortOrder,
    createZone,
    deleteZone,
    getZoneDetails,
    getZonePermissions,
    updateZonePermissions,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearch,
    handleSort,
    refetchZones: fetchZones
  };
}