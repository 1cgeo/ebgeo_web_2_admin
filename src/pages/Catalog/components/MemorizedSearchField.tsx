import React, { memo } from 'react';
import { SearchField } from '@/components/Form/SearchField';
import { FormHelperText } from '@mui/material';

interface MemorizedSearchFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export const MemorizedSearchField = memo(function MemorizedSearchField({
  value,
  onChange,
  onClear,
  disabled,
  placeholder = 'Buscar modelos...'
}: MemorizedSearchFieldProps) {
  const showHelper = value.length > 0 && value.length < 3;

  return (
    <div>
      <SearchField
        value={value}
        onChange={onChange}
        onClear={onClear}
        placeholder={placeholder}
        disabled={disabled}
      />
      {showHelper && (
        <FormHelperText error>
          Digite pelo menos 3 caracteres para buscar
        </FormHelperText>
      )}
    </div>
  );
});