import { useState, useCallback, useEffect } from 'react';
import { groupsService } from '@/services/groups';
import { useDebounce } from '@/hooks/useDebounce';
import type { GroupDetails, GroupListParams, CreateGroupDTO, UpdateGroupDTO } from '@/types/groups';

type SortableFields = 'name' | 'member_count' | 'created_at' | 'updated_at' | 'model_permissions_count' | 'zone_permissions_count';

export function useGroups() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableLoading, setTableLoading] = useState(false);
  const [groups, setGroups] = useState<GroupDetails[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortableFields>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const debouncedSearch = useDebounce(search, 300);

  const fetchGroups = useCallback(async () => {
    if (debouncedSearch && debouncedSearch.length < 3) {
      return;
    }

    try {
      setTableLoading(true);
      const params: GroupListParams = {
        page: page + 1,
        limit: rowsPerPage,
        search: debouncedSearch || undefined,
        sort: sortField,
        order: sortOrder
      };

      const response = await groupsService.list(params);

      const formattedGroups = response.groups.map(group => ({
        ...group,
        created_at: new Date(group.created_at),
        updated_at: new Date(group.updated_at),
        model_permissions_count: Number(group.model_permissions_count),
        zone_permissions_count: Number(group.zone_permissions_count)
      }));

      setGroups(formattedGroups);
      setTotalCount(response.total);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setTableLoading(false);
    }
  }, [page, rowsPerPage, debouncedSearch, sortField, sortOrder]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

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
  const createGroup = async (data: CreateGroupDTO) => {
    return groupsService.create(data);
  };

  const updateGroup = async (id: string, data: UpdateGroupDTO) => {
    return groupsService.update(id, data);
  };

  const deleteGroup = async (id: string) => {
    return groupsService.delete(id);
  };

  const getGroupDetails = async (id: string) => {
    return groupsService.getDetails(id);
  };

  return {
    groups,
    totalCount,
    page,
    rowsPerPage,
    tableLoading,
    error,
    search,
    sortField,
    sortOrder,
    createGroup,
    updateGroup,
    deleteGroup,
    getGroupDetails,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearch,
    handleSort,
    refetchGroups: fetchGroups
  };
}