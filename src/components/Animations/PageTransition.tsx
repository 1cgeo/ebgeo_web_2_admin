// Path: components\Animations\PageTransition.tsx
import { Box, Fade } from '@mui/material';

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
  loading?: boolean;
  redirectTo?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  loading = false,
  redirectTo,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (redirectTo) {
      const timer = setTimeout(() => {
        navigate(redirectTo);
      }, 500); // Match fade duration

      return () => clearTimeout(timer);
    }
  }, [redirectTo, navigate]);

  return (
    <Fade in={!loading} timeout={500}>
      <Box
        sx={{
          width: '100%',
          opacity: loading ? 0 : 1,
          transition: theme =>
            theme.transitions.create('opacity', {
              duration: theme.transitions.duration.standard,
            }),
        }}
      >
        {children}
      </Box>
    </Fade>
  );
};
