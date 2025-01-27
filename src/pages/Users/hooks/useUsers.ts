// src/pages/Users/hooks/useUsers.ts

import { useState, useCallback, useEffect } from 'react';
import { usersService } from '@/services/users';
import { useDebounce } from '@/hooks/useDebounce';
import type { User, CreateUserDTO, UpdateUserDTO } from '@/types/users';
import type { FilterState, SortableFields } from '@/types/users';

const initialFilters: FilterState = {
  search: '',
  role: 'all',
  status: 'all'
};

export function useUsers() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sortField, setSortField] = useState<SortableFields>('username');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const debouncedSearch = useDebounce(filters.search, 300);

  const fetchUsers = useCallback(async () => {
    if (debouncedSearch && debouncedSearch.length < 3) {
      return;
    }

    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: debouncedSearch || undefined,
        role: filters.role === 'all' ? undefined : filters.role,
        status: filters.status,
        sort: sortField,
        order: sortOrder
      };

      const response = await usersService.list(params);
      setUsers(response.users);
      setTotalCount(response.total);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, debouncedSearch, filters.role, filters.status, sortField, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(0);
  };

  const handleSort = (field: SortableFields) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const createUser = async (data: CreateUserDTO) => {
    return usersService.create(data);
  };

  const updateUser = async (id: string, data: UpdateUserDTO) => {
    return usersService.update(id, data);
  };

  const toggleUserStatus = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;

    return usersService.update(id, {
      isActive: !user.isActive
    });
  };

  const getUserDetails = async (id: string) => {
    return usersService.getDetails(id);
  };

  return {
    users,
    totalCount,
    page,
    rowsPerPage,
    loading,
    error,
    filters,
    sortField,
    sortOrder,
    createUser,
    updateUser,
    toggleUserStatus,
    getUserDetails,
    handlePageChange,
    handleRowsPerPageChange,
    handleFilterChange,
    handleSort,
    refetchUsers: fetchUsers
  };
}