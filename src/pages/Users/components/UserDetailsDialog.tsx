// Path: pages\Users\components\UserDetailsDialog.tsx
import {
  AccountBox,
  AdminPanelSettings,
  Badge,
  Business,
  Group as GroupIcon,
  ViewInAr as ModelIcon,
  Person,
  VerifiedUser,
  LocationOn as ZoneIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import React from 'react';

import type { UserDetails } from '@/types/users';

interface UserDetailsDialogProps {
  open: boolean;
  user: UserDetails | null;
  onClose: () => void;
}

export const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({
  open,
  user,
  onClose,
}) => {
  if (!user) return null;

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          {user.role === 'admin' ? (
            <AdminPanelSettings color="primary" />
          ) : (
            <Person />
          )}
          <Typography variant="h6">Detalhes do Usuário</Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Informações Básicas */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Informações Básicas
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body1">
                      <strong>Username:</strong> {user.username}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Badge fontSize="small" color="action" />
                    <Typography variant="body1">
                      <strong>Email:</strong> {user.email}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Último acesso:</strong> {formatDate(user.lastLogin)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Criado em:</strong> {formatDate(user.createdAt)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Dados Pessoais */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Dados Pessoais
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <AccountBox fontSize="small" color="action" />
                    <Typography variant="body1">
                      <strong>Nome Completo:</strong>{' '}
                      {user.nome_completo || '-'}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Badge fontSize="small" color="action" />
                    <Typography variant="body1">
                      <strong>Nome de Guerra:</strong> {user.nome_guerra || '-'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Business fontSize="small" color="action" />
                    <Typography variant="body1">
                      <strong>Organização Militar:</strong>{' '}
                      {user.organizacao_militar || '-'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* Status e Permissões */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Status e Permissões
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, pl: 2 }}>
              <Chip
                icon={user.isActive ? <VerifiedUser /> : <Person />}
                label={user.isActive ? 'Ativo' : 'Inativo'}
                color={user.isActive ? 'success' : 'error'}
              />
              <Chip
                icon={
                  user.role === 'admin' ? <AdminPanelSettings /> : <Person />
                }
                label={user.role === 'admin' ? 'Administrador' : 'Usuário'}
                color={user.role === 'admin' ? 'primary' : 'default'}
              />
              <Chip
                icon={<GroupIcon />}
                label={`${user.groups.length} grupos`}
                variant="outlined"
              />
            </Box>
          </Grid>

          {/* Grupos */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Grupos
            </Typography>
            <List>
              {user.groups.map(group => (
                <ListItem key={group.id} divider>
                  <ListItemAvatar>
                    <Avatar>
                      <GroupIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={group.name}
                    secondary={`Adicionado em ${formatDate(group.addedAt)} por ${group.addedBy}`}
                  />
                </ListItem>
              ))}
              {user.groups.length === 0 && (
                <ListItem>
                  <ListItemText secondary="Usuário não pertence a nenhum grupo" />
                </ListItem>
              )}
            </List>
          </Grid>

          {/* Permissões de Modelos */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Acesso a Modelos ({user.permissions.models.count})
            </Typography>
            <List>
              {user.permissions.models.items.map(permission => (
                <ListItem key={permission.id} divider>
                  <ListItemAvatar>
                    <Avatar>
                      <ModelIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={permission.name}
                    secondary={`Via ${permission.accessType === 'direct' ? 'acesso direto' : `grupo ${permission.groupId}`}`}
                  />
                </ListItem>
              ))}
              {user.permissions.models.items.length === 0 && (
                <ListItem>
                  <ListItemText secondary="Sem acesso a modelos" />
                </ListItem>
              )}
            </List>
          </Grid>

          {/* Permissões de Zonas */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Acesso a Zonas ({user.permissions.zones.count})
            </Typography>
            <List>
              {user.permissions.zones.items.map(permission => (
                <ListItem key={permission.id} divider>
                  <ListItemAvatar>
                    <Avatar>
                      <ZoneIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={permission.name}
                    secondary={`Via ${permission.accessType === 'direct' ? 'acesso direto' : `grupo ${permission.groupId}`}`}
                  />
                </ListItem>
              ))}
              {user.permissions.zones.items.length === 0 && (
                <ListItem>
                  <ListItemText secondary="Sem acesso a zonas" />
                </ListItem>
              )}
            </List>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};
