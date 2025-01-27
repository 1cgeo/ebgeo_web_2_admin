import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Group as GroupIcon,
  ViewInAr as ModelIcon,
  LocationOn as ZoneIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import type { GroupDetails } from '@/types/groups';

interface GroupDetailsDialogProps {
  open: boolean;
  group: GroupDetails | null;
  onClose: () => void;
}

export const GroupDetailsDialog: React.FC<GroupDetailsDialogProps> = ({
  open,
  group,
  onClose
}) => {
  if (!group) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog 
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <GroupIcon color="primary" />
          <Typography variant="h6">
            Detalhes do Grupo
          </Typography>
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
              <Typography variant="body1" gutterBottom>
                <strong>Nome:</strong> {group.name}
              </Typography>
              {group.description && (
                <Typography variant="body1" gutterBottom>
                  <strong>Descrição:</strong> {group.description}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                Criado em {formatDate(group.created_at)} por {group.created_by_name}
                <br />
                Última atualização em {formatDate(group.updated_at)}
              </Typography>
            </Box>
          </Grid>

          {/* Estatísticas */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Estatísticas
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, pl: 2 }}>
              <Chip
                icon={<PersonIcon />}
                label={`${group.member_count} membros`}
                variant="outlined"
              />
              <Chip
                icon={<ModelIcon />}
                label={`${group.model_permissions?.length || 0} modelos`}
                variant="outlined"
              />
              <Chip
                icon={<ZoneIcon />}
                label={`${group.zone_permissions?.length || 0} zonas`}
                variant="outlined"
              />
            </Box>
          </Grid>

          {/* Membros */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Membros
            </Typography>
            <List>
              {group.members.map((member) => (
                <ListItem key={member.id} divider>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={member.username}
                    secondary={`Adicionado em ${formatDate(new Date(member.addedAt))} por ${member.addedBy}`}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Permissões de Modelos */}
          {group.model_permissions && group.model_permissions.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Permissões de Modelos
              </Typography>
              <List>
                {group.model_permissions.map((permission) => (
                  <ListItem key={permission.id} divider>
                    <ListItemAvatar>
                      <Avatar>
                        <ModelIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={permission.name}
                      secondary={`Tipo: ${permission.type} | Nível de acesso: ${permission.access_level}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}

          {/* Permissões de Zonas */}
          {group.zone_permissions && group.zone_permissions.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Permissões de Zonas
              </Typography>
              <List>
                {group.zone_permissions.map((permission) => (
                  <ListItem key={permission.id} divider>
                    <ListItemAvatar>
                      <Avatar>
                        <ZoneIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={permission.name}
                      secondary={`Área: ${permission.area_km2.toLocaleString()} km²`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};