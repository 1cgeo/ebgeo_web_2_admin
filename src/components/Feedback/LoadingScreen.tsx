// Path: components\Feedback\LoadingScreen.tsx
import { Box, CircularProgress, Typography } from '@mui/material';

import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <CircularProgress size={60} />
      <Typography variant="h6" mt={2}>
        Carregando...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
