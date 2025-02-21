// Path: pages\Catalog\components\ModelPermissionsDialog.tsx
import { Lock, LockOpen } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';

import React, { useEffect, useState } from 'react';

import { groupsService } from '@/services/groups';
import { usersService } from '@/services/users';
import { ModelAccessLevel } from '@/types/catalog';
import type {
  ModelPermissions,
  ModelPermissionsFormData,
} from '@/types/catalog';
import type { GroupDetails } from '@/types/groups';
import type { User } from '@/types/users';

interface ModelPermissionsDialogProps {
  open: boolean;
  modelId: string | null;
  onClose: () => void;
  onSubmit: (data: ModelPermissionsFormData) => Promise<void>;
  initialData?: ModelPermissions | null;
}

export const ModelPermissionsDialog: React.FC<ModelPermissionsDialogProps> = ({
  open,
  modelId: _modelId,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [accessLevel, setAccessLevel] = useState<ModelAccessLevel>(
    ModelAccessLevel.PRIVATE,
  );
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<GroupDetails[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<GroupDetails[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (open) {
      fetchUsers();
      fetchGroups();

      if (initialData) {
        setAccessLevel(initialData.access_level);
        // Map initial users and groups
        const initialUsers = users.filter(user =>
          initialData.user_permissions.some(p => p.id === user.id),
        );
        const initialGroups = groups.filter(group =>
          initialData.group_permissions.some(p => p.id === group.id),
        );
        setSelectedUsers(initialUsers);
        setSelectedGroups(initialGroups);
      } else {
        setAccessLevel(ModelAccessLevel.PRIVATE);
        setSelectedUsers([]);
        setSelectedGroups([]);
      }
    }
  }, [open, initialData, users, groups]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        access_level: accessLevel,
        userIds: selectedUsers.map(user => user.id),
        groupIds: selectedGroups.map(group => group.id),
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>
        Gerenciar Permissões do Modelo
        {initialData && (
          <Typography variant="subtitle1" color="text.secondary">
            {initialData.model_name}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Nível de Acesso
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={accessLevel}
              onChange={e => setAccessLevel(e.target.value as ModelAccessLevel)}
            >
              <FormControlLabel
                value={ModelAccessLevel.PUBLIC}
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LockOpen color="success" />
                    <span>Público (visível para todos)</span>
                  </Box>
                }
              />
              <FormControlLabel
                value={ModelAccessLevel.PRIVATE}
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Lock color="error" />
                    <span>Privado (acesso restrito)</span>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Usuários com Acesso
          </Typography>
          <Autocomplete
            multiple
            options={users}
            getOptionLabel={option => `${option.username} (${option.email})`}
            value={selectedUsers}
            onChange={(_, newValue) => setSelectedUsers(newValue)}
            renderInput={params => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Selecione os usuários"
              />
            )}
            disabled={loading || accessLevel === ModelAccessLevel.PUBLIC}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Grupos com Acesso
          </Typography>
          <Autocomplete
            multiple
            options={groups}
            getOptionLabel={option => option.name}
            value={selectedGroups}
            onChange={(_, newValue) => setSelectedGroups(newValue)}
            renderInput={params => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Selecione os grupos"
              />
            )}
            disabled={loading || accessLevel === ModelAccessLevel.PUBLIC}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
