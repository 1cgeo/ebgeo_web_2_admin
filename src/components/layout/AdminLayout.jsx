import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const DRAWER_WIDTH = 240;

const AdminLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box className="flex h-screen overflow-hidden">
      <Sidebar 
        open={isSidebarOpen}
        onClose={handleSidebarToggle}
        width={DRAWER_WIDTH}
        variant={isMobile ? 'temporary' : 'permanent'}
      />
      
      <Box 
        className="flex flex-col flex-1"
        sx={{
          width: {
            md: `calc(100% - ${isSidebarOpen ? DRAWER_WIDTH : 0}px)`
          },
          ml: {
            md: isSidebarOpen ? `${DRAWER_WIDTH}px` : 0
          },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
          })
        }}
      >
        <Header 
          onSidebarToggle={handleSidebarToggle}
          isSidebarOpen={isSidebarOpen}
        />
        
        <Box 
          component="main"
          className="flex-1 overflow-y-auto p-6"
          sx={{
            backgroundColor: theme => theme.palette.background.default
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;