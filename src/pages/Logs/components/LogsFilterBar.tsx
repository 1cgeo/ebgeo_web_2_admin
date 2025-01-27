import React, { useCallback } from 'react';
import { 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField,
  Box
} from '@mui/material';
import { FilterBar } from '@/components/Form/FilterBar';
import { SearchField } from '@/components/Form/SearchField';
import type { LogLevel, LogCategory } from '@/types/logs';

const LOG_LEVELS: LogLevel[] = ['ERROR', 'WARN', 'INFO', 'DEBUG'];
const LOG_CATEGORIES: LogCategory[] = [
  'AUTH',
  'API',
  'DB',
  'SECURITY',
  'PERFORMANCE',
  'SYSTEM',
  'ACCESS',
  'ADMIN'
];

interface LogsFilterBarProps {
  search: string;
  level?: LogLevel;
  category?: LogCategory;
  limit: number;
  onSearchChange: (value: string) => void;
  onLevelChange: (level: LogLevel | undefined) => void;
  onCategoryChange: (category: LogCategory | undefined) => void;
  onLimitChange: (limit: number) => void;
}

export const LogsFilterBar: React.FC<LogsFilterBarProps> = ({
  search,
  level,
  category,
  limit,
  onSearchChange,
  onLevelChange,
  onCategoryChange,
  onLimitChange
}) => {
  const handleClearSearch = useCallback(() => {
    onSearchChange('');
  }, [onSearchChange]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  return (
    <FilterBar>
      <Box sx={{ width: 300 }}>
        <SearchField
          value={search}
          onChange={handleSearchChange}
          onClear={handleClearSearch}
          placeholder="Buscar logs..."
        />
      </Box>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Nível</InputLabel>
        <Select
          value={level || ''}
          onChange={(e) => onLevelChange(e.target.value as LogLevel || undefined)}
          label="Nível"
        >
          <MenuItem value="">Todos</MenuItem>
          {LOG_LEVELS.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Categoria</InputLabel>
        <Select
          value={category || ''}
          onChange={(e) => onCategoryChange(e.target.value as LogCategory || undefined)}
          label="Categoria"
        >
          <MenuItem value="">Todas</MenuItem>
          {LOG_CATEGORIES.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ width: 120 }}>
        <TextField
          type="number"
          label="Limite"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          inputProps={{
            min: 1,
            max: 1000,
            step: 50
          }}
        />
      </FormControl>
    </FilterBar>
  );
};