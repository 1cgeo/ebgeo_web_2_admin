// Path: components\DataDisplay\MetricCard.tsx
import { Box, Paper, Typography } from '@mui/material';

import React from 'react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  severity?: 'success' | 'warning' | 'error' | 'info';
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  severity,
}) => {
  const getColor = () => {
    if (!severity) return 'inherit';
    switch (severity) {
      case 'success':
        return 'success.main';
      case 'warning':
        return 'warning.main';
      case 'error':
        return 'error.main';
      case 'info':
        return 'info.main';
      default:
        return 'inherit';
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon && <Box sx={{ mr: 1, color: getColor() }}>{icon}</Box>}
        <Typography variant="subtitle1" color="text.secondary">
          {title}
        </Typography>
      </Box>

      <Typography
        variant="h4"
        component="div"
        gutterBottom
        sx={{ color: getColor() }}
      >
        {value}
      </Typography>

      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}

      {trend && (
        <Box
          sx={{
            mt: 'auto',
            pt: 1,
            color: trend.isPositive ? 'success.main' : 'error.main',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {trend.isPositive ? '↑' : '↓'}
          <Typography variant="body2" sx={{ ml: 0.5 }}>
            {trend.value}%
          </Typography>
        </Box>
      )}
    </Paper>
  );
};
