import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = React.useState(true);

  React.useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await auth.checkAuth();
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isChecking) {
    return (
      <Box 
        className="flex min-h-screen items-center justify-center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user || user.role !== 'admin') {
    // Redirecionar para login mantendo a URL original como state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;