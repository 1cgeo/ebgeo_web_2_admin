// Path: pages\Audit\components\AuditTable.tsx
import {
  Category as CategoryIcon,
  History as HistoryIcon,
  AccountCircle as UserIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { Box, Chip, IconButton, Tooltip } from '@mui/material';

import React from 'react';

import { DataTable } from '@/components/DataDisplay/DataTable';
import type { Column } from '@/components/DataDisplay/DataTable';

import type { AuditAction, AuditEntry } from '@/types/audit';
import { auditActionLabels, targetTypeLabels } from '@/types/audit';

interface AuditTableProps {
  entries: AuditEntry[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  loading: boolean;
  onViewDetails: (entry: AuditEntry) => void;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

type AuditEntryExtended = AuditEntry & {
  _actions?: string; // Campo virtual para ações
};

export const AuditTable: React.FC<AuditTableProps> = ({
  entries,
  totalCount,
  page,
  rowsPerPage,
  loading,
  onViewDetails,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getActionChipColor = (action: AuditAction) => {
    if (action.includes('DELETE')) return 'error';
    if (action.includes('CREATE')) return 'success';
    if (action.includes('UPDATE') || action.includes('CHANGE'))
      return 'warning';
    return 'default';
  };

  // Estendemos as entradas com o campo virtual de ações
  const extendedEntries: AuditEntryExtended[] = entries.map(entry => ({
    ...entry,
    _actions: 'actions',
  }));

  const columns: Column<AuditEntryExtended>[] = [
    {
      id: 'timestamp',
      label: 'Data/Hora',
      format: value => formatDate(value as string),
    },
    {
      id: 'action',
      label: 'Ação',
      format: value => (
        <Chip
          label={auditActionLabels[value as AuditAction]}
          size="small"
          color={getActionChipColor(value as AuditAction)}
        />
      ),
    },
    {
      id: 'actor',
      label: 'Usuário',
      format: value => {
        const actor = value as AuditEntry['actor'];
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <UserIcon fontSize="small" />
            {actor.username}
          </Box>
        );
      },
    },
    {
      id: 'target',
      label: 'Alvo',
      format: value => {
        const target = value as AuditEntry['target'];
        if (!target) return '-';
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CategoryIcon fontSize="small" />
            <span>
              {targetTypeLabels[target.type]}: {target.name}
            </span>
          </Box>
        );
      },
    },
    {
      id: 'ip',
      label: 'IP',
      align: 'center',
    },
    {
      id: '_actions',
      label: 'Ações',
      align: 'right',
      format: (_, row) => (
        <Tooltip title="Ver detalhes">
          <IconButton size="small" onClick={() => onViewDetails(row)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={extendedEntries}
      totalCount={totalCount}
      page={page}
      rowsPerPage={rowsPerPage}
      loading={loading}
      emptyState={{
        title: 'Nenhum registro encontrado',
        description:
          'Não há registros de auditoria para os filtros selecionados',
        icon: <HistoryIcon sx={{ fontSize: 48 }} />,
      }}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
};
