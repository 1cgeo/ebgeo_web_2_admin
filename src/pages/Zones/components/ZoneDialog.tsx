import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box
} from '@mui/material';
import { usersService } from '@/services/users';
import { groupsService } from '@/services/groups';
import { zonesService } from '@/services/zones';
import type { User } from '@/types/users';
import type { GroupDetails } from '@/types/groups';
import type { ZoneFormData } from '@/types/geographic';

interface ZoneDialogProps {
  open: boolean;
  zoneId: string | null;
  onClose: () => void;
  onSubmit: (data: ZoneFormData) => Promise<void>;
}

export const ZoneDialog: React.FC<ZoneDialogProps> = ({
  open,
  zoneId,
  onClose,
  onSubmit
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [geomText, setGeomText] = useState('');
  const [geomError, setGeomError] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<GroupDetails[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<GroupDetails[]>([]);
  const [loading, setLoading] = useState(false);

  const validateGeojson = (text: string): boolean => {
    try {
      const geojson = JSON.parse(text);
      if (!geojson.type || !geojson.coordinates) {
        setGeomError('GeoJSON inválido: propriedades type e coordinates são obrigatórias');
        return false;
      }
      if (!['Polygon', 'MultiPolygon'].includes(geojson.type)) {
        setGeomError('GeoJSON deve ser do tipo Polygon ou MultiPolygon');
        return false;
      }
      setGeomError('');
      return true;
    } catch {
      setGeomError('GeoJSON inválido: erro de sintaxe JSON');
      return false;
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await usersService.list({ status: 'active' });
      setUsers(response.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await groupsService.list({});
      setGroups(response.groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchZoneDetails = useCallback(async () => {
    if (!zoneId) return;
    
    try {
      setLoading(true);
      const [zone, permissions] = await Promise.all([
        zonesService.getDetails(zoneId),
        zonesService.getPermissions(zoneId)
      ]);

      setName(zone.name);
      setDescription(zone.description || '');
      setGeomText(JSON.stringify(zone.geom, null, 2));

      // Get full user objects
      const permittedUsers = await Promise.all(
        permissions.user_permissions.map(async user => {
          const details = await usersService.getDetails(user.id);
          return details;
        })
      );
      setSelectedUsers(permittedUsers);

      // Get full group objects
      const permittedGroups = await Promise.all(
        permissions.group_permissions.map(async group => {
          const details = await groupsService.getDetails(group.id);
          return details;
        })
      );
      setSelectedGroups(permittedGroups);

    } catch (error) {
      console.error('Error fetching zone:', error);
    } finally {
      setLoading(false);
    }
  }, [zoneId]);

  useEffect(() => {
    if (open) {
      fetchUsers();
      fetchGroups();
      if (zoneId) {
        fetchZoneDetails();
      } else {
        setName('');
        setDescription('');
        setGeomText('');
        setGeomError('');
        setSelectedUsers([]);
        setSelectedGroups([]);
      }
    }
  }, [open, zoneId, fetchZoneDetails]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateGeojson(geomText)) {
      return;
    }

    onSubmit({
      name,
      description,
      geom: geomText,
      userIds: selectedUsers.map(user => user.id),
      groupIds: selectedGroups.map(group => group.id)
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit
      }}
    >
      <DialogTitle>{zoneId ? 'Editar Zona' : 'Nova Zona'}</DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            autoFocus
            label="Nome da Zona"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <TextField
            label="Descrição"
            fullWidth
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <TextField
            label="Geometria (GeoJSON)"
            fullWidth
            required
            multiline
            rows={8}
            value={geomText}
            onChange={(e) => setGeomText(e.target.value)}
            error={!!geomError}
            helperText={geomError || 'Insira um GeoJSON válido do tipo Polygon ou MultiPolygon'}
          />

          <Autocomplete
            multiple
            options={users}
            getOptionLabel={(option) => option.username}
            value={selectedUsers}
            onChange={(_, newValue) => setSelectedUsers(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Usuários com Acesso"
              />
            )}
          />

          <Autocomplete
            multiple
            options={groups}
            getOptionLabel={(option) => option.name}
            value={selectedGroups}
            onChange={(_, newValue) => setSelectedGroups(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Grupos com Acesso"
              />
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};