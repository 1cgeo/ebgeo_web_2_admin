import React from 'react';
import { 
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  PersonOutline,
  Settings,
  ExitToApp
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

const Header = ({ onSidebarToggle, isSidebarOpen }) => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={onSidebarToggle}
          className="mr-2"
        >
          <MenuIcon />
        </IconButton>

        <Typography 
          variant="h6" 
          noWrap 
          component="div"
          className="flex-1"
        >
          EBGeo Admin
        </Typography>

        <Box className="flex items-center gap-2">
          <Button
            variant="text"
            color="inherit"
            onClick={handleMenuOpen}
            startIcon={<Avatar sx={{ width: 32, height: 32 }}>
              {user?.username?.[0]?.toUpperCase()}
            </Avatar>}
          >
            {user?.username}
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleMenuClose}>
              <PersonOutline className="mr-2" /> Perfil
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Settings className="mr-2" /> Configurações
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} className="text-red-600">
              <ExitToApp className="mr-2" /> Sair
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;