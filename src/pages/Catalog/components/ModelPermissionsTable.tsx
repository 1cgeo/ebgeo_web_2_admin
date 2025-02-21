// Path: pages\Catalog\components\ModelPermissionsTable.tsx
import {
  Edit,
  Group,
  Lock,
  LockOpen,
  Person,
  ViewInAr,
} from '@mui/icons-material';
import { Box, Chip, IconButton, Tooltip } from '@mui/material';

import React from 'react';

import { DataTable } from '@/components/DataDisplay/DataTable';
import type { Column, DataItem } from '@/components/DataDisplay/DataTable';

import type {
  ModelAccessLevel,
  ModelPermissionsSummary,
} from '@/types/catalog';

type SortableFields =
  | 'model_name'
  | 'model_type'
  | 'data_carregamento'
  | 'access_level'
  | 'user_count'
  | 'group_count';
type ModelPermissionsDataItem = ModelPermissionsSummary & DataItem;

interface ModelPermissionsTableProps {
  models: ModelPermissionsSummary[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  loading: boolean;
  sortField: SortableFields;
  sortOrder: 'asc' | 'desc';
  onSort: (field: SortableFields) => void;
  onEdit: (id: string) => void;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ModelPermissionsTable: React.FC<ModelPermissionsTableProps> = ({
  models,
  totalCount,
  page,
  rowsPerPage,
  loading,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Type-safe sort handler
  const sortHandler = (field: keyof ModelPermissionsDataItem) => {
    if (typeof field === 'string' && isSortableField(field)) {
      onSort(field);
    }
  };

  const isSortableField = (field: string): field is SortableFields => {
    return [
      'model_name',
      'model_type',
      'data_carregamento',
      'access_level',
      'user_count',
      'group_count',
    ].includes(field);
  };

  const getAccessLevelIcon = (level: ModelAccessLevel) => {
    return level === 'public' ? (
      <LockOpen fontSize="small" />
    ) : (
      <Lock fontSize="small" />
    );
  };

  const getAccessLevelColor = (
    level: ModelAccessLevel,
  ): 'default' | 'success' | 'error' => {
    return level === 'public' ? 'success' : 'error';
  };

  const columns: Column<ModelPermissionsDataItem>[] = [
    {
      id: 'model_name',
      label: 'Nome do Modelo',
      sortable: true,
      format: (value, _row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ViewInAr color="action" fontSize="small" />
          <span>{value as string}</span>
        </Box>
      ),
    },
    {
      id: 'model_type',
      label: 'Tipo',
      sortable: true,
      format: value => (
        <Chip label={value as string} size="small" variant="outlined" />
      ),
    },
    {
      id: 'access_level',
      label: 'Acesso',
      align: 'center',
      sortable: true,
      format: value => {
        const level = value as ModelAccessLevel;
        return (
          <Tooltip title={level === 'public' ? 'Público' : 'Privado'}>
            <Chip
              icon={getAccessLevelIcon(level)}
              label={level === 'public' ? 'Público' : 'Privado'}
              size="small"
              color={getAccessLevelColor(level)}
              variant="outlined"
            />
          </Tooltip>
        );
      },
    },
    {
      id: 'user_count',
      label: 'Usuários',
      align: 'center',
      sortable: true,
      format: value => (
        <Chip
          label={value?.toString() || '0'}
          size="small"
          variant="outlined"
          icon={<Person sx={{ fontSize: 16 }} />}
        />
      ),
    },
    {
      id: 'group_count',
      label: 'Grupos',
      align: 'center',
      sortable: true,
      format: value => (
        <Chip
          label={value?.toString() || '0'}
          size="small"
          variant="outlined"
          icon={<Group sx={{ fontSize: 16 }} />}
        />
      ),
    },
    {
      id: 'data_carregamento',
      label: 'Carregado em',
      sortable: true,
      format: value => formatDate(value as Date),
    },
    {
      id: 'actions',
      label: 'Ações',
      align: 'right',
      format: (_, row) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            size="small"
            onClick={() => onEdit(row.model_id)}
            title="Editar permissões"
          >
            <Edit fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <DataTable<ModelPermissionsDataItem>
      columns={columns}
      data={models as ModelPermissionsDataItem[]}
      totalCount={totalCount}
      page={page}
      rowsPerPage={rowsPerPage}
      loading={loading}
      orderBy={sortField}
      order={sortOrder}
      onSort={sortHandler}
      emptyState={{
        title: 'Nenhum modelo encontrado',
        description: 'Tente ajustar os filtros da busca',
        icon: <ViewInAr sx={{ fontSize: 48 }} />,
      }}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
};
