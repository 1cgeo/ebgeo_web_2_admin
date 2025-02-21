// Path: pages\Users\components\UsersFilterBar.tsx
import { MenuItem, TextField } from '@mui/material';

import React from 'react';

import { FilterBar } from '@/components/Form/FilterBar';
import { SearchField } from '@/components/Form/SearchField';

import type { FilterState } from '@/types/users';

interface UsersFilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
}

const roleOptions = [
  { value: 'all', label: 'Todos os perfis' },
  { value: 'admin', label: 'Administradores' },
  { value: 'user', label: 'Usuários' },
] as const;

const statusOptions = [
  { value: 'all', label: 'Todos os status' },
  { value: 'active', label: 'Ativos' },
  { value: 'inactive', label: 'Inativos' },
] as const;

export const UsersFilterBar: React.FC<UsersFilterBarProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  const handleSearchClear = () => {
    onFilterChange({ search: '' });
  };

  return (
    <FilterBar>
      <SearchField
        value={filters.search}
        onChange={handleSearchChange}
        onClear={handleSearchClear}
        placeholder="Buscar por nome ou email..."
      />

      <TextField
        select
        label="Perfil"
        value={filters.role}
        onChange={e =>
          onFilterChange({ role: e.target.value as FilterState['role'] })
        }
        sx={{ minWidth: 200 }}
      >
        {roleOptions.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Status"
        value={filters.status}
        onChange={e =>
          onFilterChange({ status: e.target.value as FilterState['status'] })
        }
        sx={{ minWidth: 200 }}
      >
        {statusOptions.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </FilterBar>
  );
};
