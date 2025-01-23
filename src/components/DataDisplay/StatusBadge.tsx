import React from 'react';
import { Chip, ChipProps } from '@mui/material';

type StatusType = 'active' | 'inactive' | 'pending' | 'error' | 'success' | 'warning';

interface StatusBadgeProps extends Omit<ChipProps, 'color'> {
  status: StatusType;
}

const statusConfig: Record<StatusType, { color: ChipProps['color']; label: string }> = {
  active: { color: 'success', label: 'Ativo' },
  inactive: { color: 'default', label: 'Inativo' },
  pending: { color: 'warning', label: 'Pendente' },
  error: { color: 'error', label: 'Erro' },
  success: { color: 'success', label: 'Sucesso' },
  warning: { color: 'warning', label: 'Atenção' }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, ...props }) => {
  const config = statusConfig[status];
  
  return (
    <Chip
      size="small"
      color={config.color}
      label={label || config.label}
      {...props}
    />
  );
};