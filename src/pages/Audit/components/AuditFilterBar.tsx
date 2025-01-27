import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
  Tooltip,
  SelectChangeEvent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FilterBar } from '@/components/Form/FilterBar';
import { SearchField } from '@/components/Form/SearchField';
import { Clear as ClearIcon } from '@mui/icons-material';
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
  loading
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleActionChange = (e: SelectChangeEvent<string>) => {
    onActionChange(e.target.value as AuditAction | '');
  };

  const handleStartDateChange = (date: Date | null) => {
    onDateRangeChange([date, dateRange[1]]);
  };

  const handleEndDateChange = (date: Date | null) => {
    onDateRangeChange([dateRange[0], date]);
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
            value={dateRange[0]}
            onChange={handleStartDateChange}
            disabled={loading}
            slotProps={{ textField: { size: 'small' } }}
          />
          <DatePicker
            label="Data Final"
            value={dateRange[1]}
            onChange={handleEndDateChange}
            disabled={loading}
            slotProps={{ textField: { size: 'small' } }}
          />
        </Box>

        {/* Seletor de Ação */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Tipo de Ação</InputLabel>
          <Select
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
        <Tooltip title="Limpar filtros">
          <IconButton 
            onClick={onClearFilters}
            disabled={loading}
            sx={{ alignSelf: 'center' }}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </FilterBar>
  );
};