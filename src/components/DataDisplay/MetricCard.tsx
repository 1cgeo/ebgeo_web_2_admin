import React from 'react';
import { Box, Paper, Typography, Skeleton } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  loading = false
}) => {
  if (loading) {
    return (
      <Paper sx={{ p: 2 }}>
        <Skeleton width="60%" height={24} />
        <Skeleton width="100%" height={40} />
        {subtitle && <Skeleton width="40%" height={20} />}
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon && (
          <Box sx={{ mr: 1, color: 'primary.main' }}>
            {icon}
          </Box>
        )}
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
      </Box>
      
      <Typography variant="h4" component="div" gutterBottom>
        {value}
      </Typography>
      
      {(subtitle || trend) && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {trend && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: trend.isPositive ? 'success.main' : 'error.main'
              }}
            >
              {trend.isPositive ? <TrendingUp /> : <TrendingDown />}
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {trend.value}%
              </Typography>
            </Box>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
};
