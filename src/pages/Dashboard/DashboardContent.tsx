import { Box, Typography, Fade } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { PageHeader } from '@/components/Layout/PageHeader';

const DashboardContent = () => {
  return (
    <Box>
      <Fade in={true} timeout={800}>
        <Box>
          <PageHeader 
            title="Dashboard"
            subtitle="Visão geral do sistema"
          />
        </Box>
      </Fade>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item, index) => (
            <Grid size={3} key={item}>
              <Fade in={true} timeout={800} style={{ transitionDelay: `${index * 100}ms` }}>
                <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 1 }}>
                  <Typography>Metric Card {item}</Typography>
                </Box>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardContent;