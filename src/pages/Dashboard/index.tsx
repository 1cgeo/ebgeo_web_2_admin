// Path: pages\Dashboard\index.tsx
import { Box, Fade } from '@mui/material';

import React, { Suspense } from 'react';

import { DashboardSkeleton } from '@/components/Loading/DashboardSkeleton';

const DashboardContent = React.lazy(() => import('./DashboardContent'));

const DashboardPage = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: theme => theme.palette.background.default,
        transition: theme =>
          theme.transitions.create('background-color', {
            duration: theme.transitions.duration.standard,
          }),
      }}
    >
      <Fade in={!isLoading} timeout={500}>
        <Box>
          <Suspense fallback={<DashboardSkeleton />}>
            <DashboardContent />
          </Suspense>
        </Box>
      </Fade>

      <Fade in={isLoading} timeout={500}>
        <Box sx={{ position: 'absolute', top: 0 }}>
          <DashboardSkeleton />
        </Box>
      </Fade>
    </Box>
  );
};

export default DashboardPage;
