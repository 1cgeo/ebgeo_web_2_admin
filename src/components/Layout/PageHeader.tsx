import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useGlobal } from '@/context/GlobalContext';

interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, actions }) => {
  const { state } = useGlobal();

  return (
    <Box sx={{ mb: 3 }}>
      {state.breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 1 }}>
          {state.breadcrumbs.map((crumb, index) => (
            crumb.href ? (
              <Link
                key={index}
                component={RouterLink}
                to={crumb.href}
                color="inherit"
              >
                {crumb.text}
              </Link>
            ) : (
              <Typography key={index} color="text.primary">
                {crumb.text}
              </Typography>
            )
          ))}
        </Breadcrumbs>
      )}
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        {actions && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  );
};