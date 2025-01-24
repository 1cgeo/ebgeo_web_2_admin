import { Box, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid2';

export const DashboardSkeleton = () => (
  <Box sx={{ width: '100%', py: 3 }}>
    {/* Header Skeleton */}
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" width="250px" height={40} />
      <Skeleton variant="text" width="150px" height={24} />
    </Box>

    {/* Metrics Cards Skeleton */}
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {[1, 2, 3, 4].map((item) => (
        <Grid size={3} key={item}>
          <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="100%" height={40} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
        </Grid>
      ))}
    </Grid>

    {/* Charts Skeleton */}
    <Grid container spacing={3}>
      <Grid size={8}>
        <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 1 }}>
          <Skeleton variant="text" width="200px" height={24} />
          <Skeleton variant="rectangular" width="100%" height={300} />
        </Box>
      </Grid>
      <Grid size={4}>
        <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 1 }}>
          <Skeleton variant="text" width="150px" height={24} />
          <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto', my: 2 }} />
        </Box>
      </Grid>
    </Grid>
  </Box>
);