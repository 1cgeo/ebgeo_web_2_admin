import React, { useCallback } from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { FilterBar } from '@/components/Form/FilterBar';
import { MemorizedSearchField } from './MemorizedSearchField';
import { ModelAccessLevel } from '@/types/catalog';
import Grid from '@mui/material/Grid2';

interface ModelPermissionsFilterBarProps {
  search: string;
  accessLevel: ModelAccessLevel | '';
  modelType: string;
  loading?: boolean;
  onSearch: (value: string) => void;
  onAccessLevelChange: (level: ModelAccessLevel | '') => void;
  onTypeChange: (type: string) => void;
}

const MODEL_TYPES = [
  'CESIUM_3D_TILES',
  'KML',
  'COLLADA',
  'GLTF'
];

export const ModelPermissionsFilterBar: React.FC<ModelPermissionsFilterBarProps> = ({
  search,
  accessLevel,
  modelType,
  loading,
  onSearch,
  onAccessLevelChange,
  onTypeChange
}) => {
  const handleClear = useCallback(() => {
    onSearch('');
  }, [onSearch]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  }, [onSearch]);

  const handleAccessLevelChange = (event: SelectChangeEvent) => {
    onAccessLevelChange(event.target.value as ModelAccessLevel | '');
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    onTypeChange(event.target.value as string);
  };

  return (
    <FilterBar>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <MemorizedSearchField
            value={search}
            onChange={handleChange}
            onClear={handleClear}
            placeholder="Buscar modelos..."
            disabled={loading}
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Nível de Acesso</InputLabel>
            <Select
              value={accessLevel}
              label="Nível de Acesso"
              onChange={handleAccessLevelChange}
              disabled={loading}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value={ModelAccessLevel.PUBLIC}>Público</MenuItem>
              <MenuItem value={ModelAccessLevel.PRIVATE}>Privado</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Tipo de Modelo</InputLabel>
            <Select
              value={modelType}
              label="Tipo de Modelo"
              onChange={handleTypeChange}
              disabled={loading}
            >
              <MenuItem value="">Todos</MenuItem>
              {MODEL_TYPES.map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </FilterBar>
  );
};