// Path: components\Layout\PageContainer.tsx
import { Box, Paper } from '@mui/material';

import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  noPadding?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = 'lg',
  noPadding = false,
}) => {
  return (
    <Box
      sx={{
        maxWidth: theme => theme.breakpoints.values[maxWidth],
        mx: 'auto',
        width: '100%',
      }}
    >
      <Paper
        sx={{
          p: noPadding ? 0 : 3,
          height: '100%',
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};
