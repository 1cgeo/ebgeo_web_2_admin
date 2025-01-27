import React from 'react';
import { Box, IconButton, Chip } from '@mui/material';
import { Edit, Delete, Visibility, Map, Group } from '@mui/icons-material';
import { DataTable } from '@/components/DataDisplay/DataTable';
import type { ZoneWithStats } from '@/types/geographic';
import type { DataItem, Column } from '@/components/DataDisplay/DataTable';

type SortableFields = 'name' | 'created_at' | 'area_km2' | 'user_count' | 'group_count';
type ZoneDataItem = ZoneWithStats & DataItem;

interface ZonesTableProps {
  zones: ZoneWithStats[];
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

export const ZonesTable: React.FC<ZonesTableProps> = ({
  zones,
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

  const formatArea = (area: number) => {
    return `${area.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    })} km²`;
  };

  const sortHandler = (field: keyof ZoneDataItem) => {
    if (typeof field === 'string' && [
      'name', 'created_at', 'area_km2', 'user_count', 'group_count'
    ].includes(field)) {
      onSort(field as SortableFields);
    }
  };

  const columns: Column<ZoneDataItem>[] = [
    {
      id: 'name',
      label: 'Nome',
      sortable: true
    },
    {
      id: 'area_km2',
      label: 'Área',
      align: 'right',
      sortable: true,
      format: (value) => (
        <Chip 
          label={formatArea(value as number)} 
          size="small" 
          variant="outlined"
          icon={<Map sx={{ fontSize: 16 }} />}
        />
      )
    },
    {
      id: 'user_count',
      label: 'Usuários',
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
      id: 'group_count',
      label: 'Grupos',
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
      id: 'created_at',
      label: 'Criado em',
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
    <DataTable<ZoneDataItem>
      columns={columns}
      data={zones as ZoneDataItem[]}
      totalCount={totalCount}
      page={page}
      rowsPerPage={rowsPerPage}
      loading={loading}
      orderBy={sortField}
      order={sortOrder}
      onSort={sortHandler}
      emptyState={{
        title: 'Nenhuma zona encontrada',
        description: 'Crie uma nova zona para começar',
        icon: <Map sx={{ fontSize: 48 }} />
      }}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
};