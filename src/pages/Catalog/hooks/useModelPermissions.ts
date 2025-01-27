import { useState, useCallback, useEffect } from 'react';
import { catalogService } from '@/services/catalog';
import { useDebounce } from '@/hooks/useDebounce';
import type { 
  ModelPermissionsSummary, 
  UpdateModelPermissionsRequest,
  ModelAccessLevel
} from '@/types/catalog';

type SortableFields = 'model_name' | 'model_type' | 'data_carregamento' | 'access_level' | 'user_count' | 'group_count';

export function useModelPermissions() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<ModelPermissionsSummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortableFields>('model_name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [accessLevelFilter, setAccessLevelFilter] = useState<ModelAccessLevel | ''>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const debouncedSearch = useDebounce(search, 300);

  const fetchModelPermissions = useCallback(async () => {
    if (debouncedSearch && debouncedSearch.length < 3) {
      return;
    }

    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: debouncedSearch || undefined,
        sort: sortField,
        order: sortOrder,
        access_level: accessLevelFilter || undefined,
        model_type: typeFilter || undefined
      };

      const response = await catalogService.listPermissions(params);

      const formattedModels = response.models.map(model => ({
        ...model,
        data_carregamento: new Date(model.data_carregamento)
      }));

      setModels(formattedModels);
      setTotalCount(response.total);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, debouncedSearch, sortField, sortOrder, accessLevelFilter, typeFilter]);

  useEffect(() => {
    fetchModelPermissions();
  }, [fetchModelPermissions]);

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

  const handleAccessLevelFilter = (level: ModelAccessLevel | '') => {
    setAccessLevelFilter(level);
    setPage(0);
  };

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
    setPage(0);
  };

  const getModelPermissions = async (modelId: string) => {
    return catalogService.getPermissions(modelId);
  };

  const updateModelPermissions = async (modelId: string, data: UpdateModelPermissionsRequest) => {
    await catalogService.updatePermissions(modelId, data);
  };

  return {
    models,
    totalCount,
    page,
    rowsPerPage,
    loading,
    error,
    search,
    sortField,
    sortOrder,
    accessLevelFilter,
    typeFilter,
    getModelPermissions,
    updateModelPermissions,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearch,
    handleSort,
    handleAccessLevelFilter,
    handleTypeFilter,
    refetchPermissions: fetchModelPermissions
  };
}