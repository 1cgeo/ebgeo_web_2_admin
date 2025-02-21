// Path: components\Feedback\PageLoader.tsx
import { Backdrop, CircularProgress } from '@mui/material';

import React from 'react';

import { useGlobal } from '@/context/GlobalContext';

export const PageLoader: React.FC = () => {
  const { state } = useGlobal();

  return (
    <Backdrop
      sx={{
        zIndex: theme => theme.zIndex.drawer + 1,
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
      open={state.loading.global}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
