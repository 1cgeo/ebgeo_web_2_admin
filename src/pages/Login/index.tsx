import { Box, useMediaQuery, useTheme } from '@mui/material';
import { BackgroundSlider } from '@/components/Login/BackgroundSlider';
import { LoginForm } from '@/components/Login/LoginForm';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

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
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: isMobile ? 2 : 4,
        overflow: 'hidden',
      }}
    >
      <BackgroundSlider />
      <LoginForm />
    </Box>
  );
};

export default LoginPage;