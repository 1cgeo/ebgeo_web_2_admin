import React from 'react';
import { Box, Button } from '@mui/material';

interface FormActionsProps {
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  isSubmitting = false,
  submitLabel = 'Salvar',
  cancelLabel = 'Cancelar'
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 2,
        mt: 4
      }}
    >
      {onCancel && (
        <Button 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelLabel}
        </Button>
      )}
      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Salvando...' : submitLabel}
      </Button>
    </Box>
  );
};