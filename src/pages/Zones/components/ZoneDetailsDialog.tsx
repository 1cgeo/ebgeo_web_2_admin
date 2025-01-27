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
  Avatar
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Map as MapIcon,
  Person as PersonIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ZoneWithStats, ZonePermissions } from '@/types/geographic';

interface ZoneDetailsDialogProps {
  open: boolean;
  zone: ZoneWithStats | null;
  permissions: ZonePermissions | null;
  onClose: () => void;
}

export const ZoneDetailsDialog: React.FC<ZoneDetailsDialogProps> = ({
  open,
  zone,
  permissions,
  onClose
}) => {
  // Calculate bounds for map
  const bounds = React.useMemo<L.LatLngBounds | undefined>(() => {
    if (!zone?.geom) return undefined;
    
    try {
      const geoJsonLayer = L.geoJSON(zone.geom);
      return geoJsonLayer.getBounds();
    } catch (error) {
      console.error('Error calculating bounds:', error);
      return undefined;
    }
  }, [zone?.geom]);

  if (!zone || !permissions) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatArea = (area: number) => {
    return area.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <Dialog 
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <MapIcon color="primary" />
          <Typography variant="h6">
            Detalhes da Zona
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Informações Básicas */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Informações Básicas
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Nome:</strong> {zone.name}
              </Typography>
              {zone.description && (
                <Typography variant="body1" gutterBottom>
                  <strong>Descrição:</strong> {zone.description}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Criado em {formatDate(zone.created_at)}
              </Typography>
            </Box>
          </Grid>

          {/* Estatísticas */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Estatísticas
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, pl: 2 }}>
              <Chip
                icon={<MapIcon />}
                label={`${formatArea(zone.area_km2)} km²`}
                variant="outlined"
              />
              <Chip
                icon={<PersonIcon />}
                label={`${zone.user_count} usuários`}
                variant="outlined"
              />
              <Chip
                icon={<GroupIcon />}
                label={`${zone.group_count} grupos`}
                variant="outlined"
              />
            </Box>
          </Grid>

          {/* Mapa */}
          <Grid size={{ xs: 12}}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Visualização
            </Typography>
            <Box sx={{ height: 400, width: '100%', borderRadius: 1, overflow: 'hidden' }}>
              {bounds && (
                <MapContainer
                  bounds={bounds}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <GeoJSON data={zone.geom} />
                </MapContainer>
              )}
            </Box>
          </Grid>

          {/* Usuários com Acesso */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Usuários com Acesso
            </Typography>
            <List>
              {permissions.user_permissions.map((user) => (
                <ListItem key={user.id} divider>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.username}
                  />
                </ListItem>
              ))}
              {permissions.user_permissions.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="Nenhum usuário com acesso direto"
                    sx={{ color: 'text.secondary' }}
                  />
                </ListItem>
              )}
            </List>
          </Grid>

          {/* Grupos com Acesso */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Grupos com Acesso
            </Typography>
            <List>
              {permissions.group_permissions.map((group) => (
                <ListItem key={group.id} divider>
                  <ListItemAvatar>
                    <Avatar>
                      <GroupIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={group.name}
                  />
                </ListItem>
              ))}
              {permissions.group_permissions.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="Nenhum grupo com acesso"
                    sx={{ color: 'text.secondary' }}
                  />
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