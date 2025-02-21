// Path: pages\Groups\components\MemorizedSearchField.tsx
import { FormHelperText } from '@mui/material';

import React, { memo } from 'react';

import { SearchField } from '@/components/Form/SearchField';

interface MemorizedSearchFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  disabled?: boolean;
}

export const MemorizedSearchField = memo(function MemorizedSearchField({
  value,
  onChange,
  onClear,
  disabled,
}: MemorizedSearchFieldProps) {
  const showHelper = value.length > 0 && value.length < 3;

  return (
    <div>
      <SearchField
        value={value}
        onChange={onChange}
        onClear={onClear}
        placeholder="Buscar grupos..."
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
