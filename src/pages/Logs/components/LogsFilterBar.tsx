// Path: pages\Logs\components\LogsFilterBar.tsx
import { FormControl, MenuItem, Select } from '@mui/material';

import React from 'react';

import { FilterBar } from '@/components/Form/FilterBar';

import type { LogCategory, LogLevel } from '@/types/logs';

const LOG_LEVELS: LogLevel[] = ['ERROR', 'WARN', 'INFO', 'DEBUG'];
const LOG_CATEGORIES: LogCategory[] = [
  'AUTH',
  'API',
  'DB',
  'SECURITY',
  'PERFORMANCE',
  'SYSTEM',
  'ACCESS',
  'ADMIN',
];

interface LogsFilterBarProps {
  level?: LogLevel;
  category?: LogCategory;
  limit: number;
  onLevelChange: (level: LogLevel | undefined) => void;
  onCategoryChange: (category: LogCategory | undefined) => void;
  onLimitChange: (limit: number) => void;
}

export const LogsFilterBar: React.FC<LogsFilterBarProps> = ({
  level,
  category,
  limit,
  onLevelChange,
  onCategoryChange,
  onLimitChange,
}) => {
  return (
    <FilterBar>
      <FormControl sx={{ minWidth: 120 }}>
        <Select
          value={level || ''}
          onChange={e =>
            onLevelChange((e.target.value as LogLevel) || undefined)
          }
          displayEmpty
        >
          <MenuItem value="">Todos os Níveis</MenuItem>
          {LOG_LEVELS.map(level => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <Select
          value={category || ''}
          onChange={e =>
            onCategoryChange((e.target.value as LogCategory) || undefined)
          }
          displayEmpty
        >
          <MenuItem value="">Todas as Categorias</MenuItem>
          {LOG_CATEGORIES.map(category => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ width: 120 }}>
        <Select
          value={limit}
          onChange={e => onLimitChange(Number(e.target.value))}
        >
          <MenuItem value={50}>50 registros</MenuItem>
          <MenuItem value={100}>100 registros</MenuItem>
          <MenuItem value={500}>500 registros</MenuItem>
          <MenuItem value={1000}>1000 registros</MenuItem>
        </Select>
      </FormControl>
    </FilterBar>
  );
};
