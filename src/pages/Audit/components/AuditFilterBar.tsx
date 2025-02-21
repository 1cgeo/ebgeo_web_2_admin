// Path: pages\Audit\components\AuditFilterBar.tsx
import { Clear as ClearIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import React from 'react';

import { FilterBar } from '@/components/Form/FilterBar';
import { SearchField } from '@/components/Form/SearchField';

import { AuditAction, auditActionLabels } from '@/types/audit';

interface AuditFilterBarProps {
  search: string;
  dateRange: [Date | null, Date | null];
  selectedAction: AuditAction | '';
  onSearch: (value: string) => void;
  onDateRangeChange: (range: [Date | null, Date | null]) => void;
  onActionChange: (action: AuditAction | '') => void;
  onClearFilters: () => void;
  loading?: boolean;
}

export const AuditFilterBar: React.FC<AuditFilterBarProps> = ({
  search,
  dateRange,
  selectedAction,
  onSearch,
  onDateRangeChange,
  onActionChange,
  onClearFilters,
  loading,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleActionChange = (e: SelectChangeEvent<string>) => {
    onActionChange(e.target.value as AuditAction | '');
  };

  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    onDateRangeChange([date?.toDate() || null, dateRange[1]]);
  };

  const handleEndDateChange = (date: dayjs.Dayjs | null) => {
    onDateRangeChange([dateRange[0], date?.toDate() || null]);
  };

  return (
    <FilterBar>
      <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, flexWrap: 'wrap' }}>
        {/* Campo de Busca */}
        <Box sx={{ minWidth: 220, flexGrow: 1 }}>
          <SearchField
            value={search}
            onChange={handleSearchChange}
            onClear={() => onSearch('')}
            placeholder="Buscar nas trilhas..."
            disabled={loading}
          />
        </Box>

        {/* Seletor de Período */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <DatePicker
            label="Data Inicial"
            value={dateRange[0] ? dayjs(dateRange[0]) : null}
            onChange={handleStartDateChange}
            disabled={loading}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                size: 'small',
                sx: { width: '160px' },
                error: false,
              },
              actionBar: {
                actions: ['clear', 'today', 'accept'],
              },
            }}
          />
          <DatePicker
            label="Data Final"
            value={dateRange[1] ? dayjs(dateRange[1]) : null}
            onChange={handleEndDateChange}
            disabled={loading}
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                size: 'small',
                sx: { width: '160px' },
                error: false,
              },
              actionBar: {
                actions: ['clear', 'today', 'accept'],
              },
            }}
          />
        </Box>

        {/* Seletor de Ação */}
        <FormControl sx={{ minWidth: 200, marginTop: 0 }}>
          <InputLabel id="action-type-label" size="small">
            Tipo de Ação
          </InputLabel>
          <Select
            labelId="action-type-label"
            value={selectedAction}
            label="Tipo de Ação"
            onChange={handleActionChange}
            disabled={loading}
            size="small"
          >
            <MenuItem value="">Todas</MenuItem>
            {Object.entries(auditActionLabels).map(([action, label]) => (
              <MenuItem key={action} value={action}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Botão Limpar Filtros */}
        <Box sx={{ alignSelf: 'center' }}>
          <span>
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={onClearFilters}
              disabled={loading}
              startIcon={<ClearIcon />}
              sx={{
                height: '40px',
                minWidth: 'auto',
              }}
            >
              Limpar
            </Button>
          </span>
        </Box>
      </Box>
    </FilterBar>
  );
};
