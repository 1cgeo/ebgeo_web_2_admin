import React from 'react';
import { Paper } from '@mui/material';

interface FilterBarProps {
  children: React.ReactNode;
  sticky?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  children,
  sticky = false
}) => {
  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        position: sticky ? 'sticky' : 'static',
        top: sticky ? 0 : 'auto',
        zIndex: 1
      }}
    >
      {children}
    </Paper>
  );
};
