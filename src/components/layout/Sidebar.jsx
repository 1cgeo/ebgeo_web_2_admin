import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Divider,
  Typography,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Group as GroupIcon,
  Assignment as AssignmentIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  ErrorOutline as ErrorIcon,
  ShowChart as MetricsIcon
} from '@mui/icons-material';

const menuItems = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: DashboardIcon
  },
  {
    title: 'Usuários',
    path: '/dashboard/users',
    icon: PeopleIcon
  },
  {
    title: 'Grupos',
    path: '/dashboard/groups',
    icon: GroupIcon
  },
  {
    title: 'Logs',
    path: '/dashboard/logs',
    icon: AssignmentIcon
  },
  {
    title: 'Permissões',
    path: '/dashboard/permissions',
    icon: SecurityIcon,
    divider: true
  },
  {
    title: 'Modelos 3D',
    path: '/dashboard/models',
    icon: StorageIcon
  },
  {
    title: 'Erros',
    path: '/dashboard/errors',
    icon: ErrorIcon
  },
  {
    title: 'Métricas',
    path: '/dashboard/metrics',
    icon: MetricsIcon
  }
];

const Sidebar = ({ open, onClose, width, variant }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    if (variant === 'temporary') {
      onClose();
    }
  };

  const drawer = (
    <Box className="h-full flex flex-col">
      <Box 
        className="p-4 flex items-center"
        sx={{ 
          minHeight: 64,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText
        }}
      >
        <Typography variant="h6" noWrap>
          EBGeo Admin
        </Typography>
      </Box>

      <Divider />

      <List className="flex-1 overflow-y-auto">
        {menuItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <ListItem disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.action.selected,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <item.icon color={location.pathname === item.path ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
            {item.divider && <Divider className="my-2" />}
          </React.Fragment>
        ))}
      </List>

      <Divider />
      
      <Box className="p-4">
        <Typography variant="caption" color="textSecondary">
          Versão 1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: width },
        flexShrink: { md: 0 }
      }}
    >
      <Drawer
        variant={variant}
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true // Melhor desempenho em mobile
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: width,
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`
          }
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;