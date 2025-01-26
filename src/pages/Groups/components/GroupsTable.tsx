import React from 'react';
import { Box, IconButton, Chip } from '@mui/material';
import { Edit, Delete, Group, Visibility } from '@mui/icons-material';
import { DataTable } from '@/components/DataDisplay/DataTable';
import type { GroupDetails, ZonePermission, ModelPermission } from '@/types/groups';
import type { DataItem, Column } from '@/components/DataDisplay/DataTable';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import Map from '@mui/icons-material/Map';

type SortableFields = 'name' | 'member_count' | 'created_at' | 'updated_at' | 'model_permissions_count' | 'zone_permissions_count';
type GroupDataItem = GroupDetails & DataItem;

interface GroupsTableProps {
  groups: GroupDetails[];
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

export const GroupsTable: React.FC<GroupsTableProps> = ({
  groups,
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
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  // Type-safe sort handler
  const sortHandler = (field: keyof GroupDataItem) => {
    if (typeof field === 'string' && ['name', 'member_count', 'created_at', 'updated_at'].includes(field)) {
      onSort(field as SortableFields);
    }
  };

  const columns: Column<GroupDataItem>[] = [
    {
      id: 'name',
      label: 'Nome',
      sortable: true
    },
    {
      id: 'member_count',
      label: 'Membros',
      align: 'center',
      sortable: true,
      format: (value) => (
        <Chip 
          label={value?.toString() || '0'} 
          size="small" 
          variant="outlined"
          icon={<Group sx={{ fontSize: 16 }} />}
        />
      )
    },
    {
      id: 'model_permissions_count',
      label: 'Permissões de modelos',
      align: 'center',
      sortable: true,
      format: (value) => (
        <Chip 
          label={`${(value as ModelPermission[]).length || 0}`} 
          size="small" 
          variant="outlined"
          icon={<ViewInArIcon sx={{ fontSize: 16 }} />}
        />
      )
    },
    {
      id: 'zone_permissions_count',
      label: 'Permissões de zonas',
      align: 'center',
      sortable: true,
      format: (value) => (
        <Chip 
          label={`${(value as ZonePermission[]).length || 0}`} 
          size="small" 
          variant="outlined"
          icon={<Map sx={{ fontSize: 16 }} />}
        />
      )
    },
    {
      id: 'created_at',
      label: 'Criado em',
      sortable: true,
      format: (value) => formatDate(value as Date)
    },
    {
      id: 'updated_at',
      label: 'Atualizado em',
      sortable: true,
      format: (value) => formatDate(value as Date)
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
            title="Excluir"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <DataTable<GroupDataItem>
      columns={columns}
      data={groups as GroupDataItem[]}
      totalCount={totalCount}
      page={page}
      rowsPerPage={rowsPerPage}
      loading={loading}
      orderBy={sortField}
      order={sortOrder}
      onSort={sortHandler}
      emptyState={{
        title: 'Nenhum grupo encontrado',
        description: 'Crie um novo grupo para começar',
        icon: <Group sx={{ fontSize: 48 }} />
      }}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
};