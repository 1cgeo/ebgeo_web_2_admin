// Path: pages\Login\index.tsx
import { Box, useMediaQuery, useTheme } from '@mui/material';

import { Navigate } from 'react-router-dom';

import { BackgroundSlider } from '@/components/Login/BackgroundSlider';
import { LoginForm } from '@/components/Login/LoginForm';

import { useAuth } from '@/hooks/useAuth';

const LoginPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: isMobile ? 2 : 4,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      >
        <BackgroundSlider />
      </Box>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <LoginForm />
      </Box>
    </Box>
  );
};

export default LoginPage;
