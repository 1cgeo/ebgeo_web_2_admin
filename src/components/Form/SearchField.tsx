import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

interface SearchFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Buscar...',
  disabled = false
}) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={onClear}
              disabled={disabled}
            >
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ) : null
      }}
    />
  );
};