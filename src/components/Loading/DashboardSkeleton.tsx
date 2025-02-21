// Path: components\Loading\DashboardSkeleton.tsx
import { Box, Skeleton } from '@mui/material';
import { Paper, Theme, styled } from '@mui/material';
import Grid from '@mui/material/Grid2';

const Item = styled(Paper)(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  height: '100%',
}));

export const DashboardSkeleton = () => (
  <Box>
    {/* Header Skeleton */}
    <Box sx={{ mb: 4 }}>
      <Skeleton variant="text" width="250px" height={40} />
      <Skeleton variant="text" width="150px" height={24} />
    </Box>

    <Grid container spacing={3}>
      {/* Status Geral */}
      {[1, 2, 3, 4].map(item => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={`status-${item}`}>
          <Item>
            <Box display="flex" alignItems="center" gap={1}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width="60%" height={24} />
            </Box>
            <Skeleton variant="text" width="100%" height={40} sx={{ mt: 2 }} />
            <Skeleton variant="text" width="40%" height={20} />
          </Item>
        </Grid>
      ))}

      {/* Serviços */}
      {[1, 2, 3, 4].map(item => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={`service-${item}`}>
          <Item>
            <Box display="flex" alignItems="center" gap={1}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width="60%" height={24} />
            </Box>
            <Skeleton variant="text" width="100%" height={40} sx={{ mt: 2 }} />
            <Skeleton variant="text" width="40%" height={20} />
          </Item>
        </Grid>
      ))}

      {/* Recursos do Sistema */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Item>
          <Skeleton variant="text" width="200px" height={24} />
          <Box mt={3} display="flex" justifyContent="space-around">
            {[1, 2].map(item => (
              <Box key={`resource-${item}`} textAlign="center">
                <Skeleton variant="circular" width={100} height={100} />
                <Skeleton
                  variant="text"
                  width={80}
                  height={24}
                  sx={{ mt: 1 }}
                />
              </Box>
            ))}
          </Box>
        </Item>
      </Grid>

      {/* Conexões de Banco */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Item>
          <Skeleton variant="text" width="200px" height={24} />
          <Box
            height={200}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Skeleton variant="circular" width={160} height={160} />
          </Box>
        </Item>
      </Grid>

      {/* Métricas de Uso */}
      {[1, 2, 3].map(item => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={`metric-${item}`}>
          <Item>
            <Box display="flex" alignItems="center" gap={1}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width="60%" height={24} />
            </Box>
            <Skeleton variant="text" width="100%" height={40} sx={{ mt: 2 }} />
            <Skeleton variant="text" width="40%" height={20} />
          </Item>
        </Grid>
      ))}

      {/* Distribuição de Modelos */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Item>
          <Skeleton variant="text" width="200px" height={24} />
          <Box
            height={200}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Skeleton variant="circular" width={160} height={160} />
          </Box>
        </Item>
      </Grid>
    </Grid>
  </Box>
);
