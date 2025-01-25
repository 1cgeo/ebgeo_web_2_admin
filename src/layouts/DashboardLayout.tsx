import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  ViewInAr as CatalogIcon,
  Map as ZoneIcon,
  Article as LogsIcon,
  History as AuditIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';

const drawerWidth = 240;

const DashboardLayout = () => {
  const theme = useTheme();
  const { logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <DashboardIcon />,
      section: 'main'
    },
    {
      title: 'Usuários',
      path: '/users',
      icon: <PersonIcon />,
      section: 'admin'
    },
    {
      title: 'Grupos',
      path: '/groups',
      icon: <GroupIcon />,
      section: 'admin'
    },
    {
      title: 'Catálogo 3D',
      path: '/catalog',
      icon: <CatalogIcon />,
      section: 'resources'
    },
    {
      title: 'Zonas Geográficas',
      path: '/zones',
      icon: <ZoneIcon />,
      section: 'resources'
    },
    {
      title: 'Logs do Sistema',
      path: '/logs',
      icon: <LogsIcon />,
      section: 'monitoring'
    },
    {
      title: 'Trilha de Auditoria',
      path: '/audit',
      icon: <AuditIcon />,
      section: 'monitoring'
    }
  ];

  const drawer = (
    <div>
      <Toolbar>
        <img src="/images/logo-ebgeo.png" alt="EBGeo" height={40} />
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.path} 
            component={Link} 
            to={item.path}
            sx={{ cursor: 'pointer' }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            EBGeo Admin
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleLogout}
            title="Sair"
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            }
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;