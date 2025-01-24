import React, { Suspense } from 'react';
import { Box, Fade } from '@mui/material';
import { DashboardSkeleton } from '@/components/Loading/DashboardSkeleton';

// Using React.lazy for component code splitting
const DashboardContent = React.lazy(() => import('./DashboardContent'));

const DashboardPage = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Minimum loading time for smooth transition

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme => theme.palette.background.default,
        transition: theme => theme.transitions.create('background-color', {
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
        <Box sx={{ position: 'absolute', width: '100%', top: 0 }}>
          <DashboardSkeleton />
        </Box>
      </Fade>
    </Box>
  );
};

export default DashboardPage;