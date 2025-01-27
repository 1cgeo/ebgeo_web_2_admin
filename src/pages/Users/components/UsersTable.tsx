import React from 'react';
import { Box, IconButton, Chip } from '@mui/material';
import {
  Edit,
  Block,
  Person,
  Visibility,
  AdminPanelSettings,
  PersonOff
} from '@mui/icons-material';
import { DataTable } from '@/components/DataDisplay/DataTable';
import type { User } from '@/types/users';
import type { DataItem, Column } from '@/components/DataDisplay/DataTable';
import type { SortableFields } from '@/types/users';

type UserTableItem = User & DataItem;

interface UsersTableProps {
  users: User[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  loading: boolean;
  sortField: SortableFields;
  sortOrder: 'asc' | 'desc';
  onSort: (field: SortableFields) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  totalCount,
  page,
  rowsPerPage,
  loading,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  onViewDetails,
  onPageChange,
  onRowsPerPageChange
}) => {
  const formatDate = (date: Date | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sortHandler = (field: keyof UserTableItem) => {
    if (Object.values(sortableFields).includes(field as SortableFields)) {
      onSort(field as SortableFields);
    }
  };

  const sortableFields: Record<string, SortableFields> = {
    username: 'username',
    email: 'email',
    role: 'role',
    isActive: 'isActive',
    lastLogin: 'lastLogin',
    groupCount: 'groupCount'
  };

  const columns: Column<UserTableItem>[] = [
    {
      id: 'username',
      label: 'Usuário',
      sortable: true,
      format: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {row.role === 'admin' ? (
            <AdminPanelSettings fontSize="small" color="primary" />
          ) : (
            <Person fontSize="small" />
          )}
          {value as string}
        </Box>
      )
    },
    {
      id: 'email',
      label: 'Email',
      sortable: true
    },
    {
      id: 'role',
      label: 'Perfil',
      align: 'center',
      sortable: true,
      format: value => (
        <Chip
          size="small"
          label={value === 'admin' ? 'Administrador' : 'Usuário'}
          color={value === 'admin' ? 'primary' : 'default'}
          variant="outlined"
        />
      )
    },
    {
      id: 'isActive',
      label: 'Status',
      align: 'center',
      sortable: true,
      format: value => (
        <Chip
          size="small"
          label={value ? 'Ativo' : 'Inativo'}
          color={value ? 'success' : 'error'}
          icon={value ? <Person /> : <PersonOff />}
        />
      )
    },
    {
      id: 'lastLogin',
      label: 'Último Acesso',
      sortable: true,
      format: value => formatDate(value as Date)
    },
    {
      id: 'groupCount',
      label: 'Grupos',
      align: 'center',
      sortable: true,
      format: value => (
        <Chip
          size="small"
          label={value?.toString() || '0'}
          variant="outlined"
        />
      )
    },
    {
      id: 'actions',
      label: 'Ações',
      align: 'right',
      format: (_, row) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => onViewDetails(row.id)}
            title="Visualizar detalhes"
          >
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onEdit(row.id)}
            title="Editar"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(row.id)}
            title={row.isActive ? 'Desativar' : 'Ativar'}
            color={row.isActive ? 'error' : 'success'}
          >
            <Block fontSize="small" />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <DataTable<UserTableItem>
      columns={columns}
      data={users as UserTableItem[]}
      totalCount={totalCount}
      page={page}
      rowsPerPage={rowsPerPage}
      loading={loading}
      orderBy={sortField}
      order={sortOrder}
      onSort={sortHandler}
      emptyState={{
        title: 'Nenhum usuário encontrado',
        description: 'Crie um novo usuário para começar',
        icon: <Person sx={{ fontSize: 48 }} />
      }}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
};