// Path: pages\Groups\components\GroupDialog.tsx
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Autocomplete } from '@mui/material';

import React, { useCallback, useEffect, useState } from 'react';

import { groupsService } from '@/services/groups';
import { usersService } from '@/services/users';
import type { GroupFormData } from '@/types/groups';
import type { User } from '@/types/users';

interface GroupDialogProps {
  open: boolean;
  groupId: string | null;
  onClose: () => void;
  onSubmit: (data: GroupFormData) => Promise<void>;
}

export const GroupDialog: React.FC<GroupDialogProps> = ({
  open,
  groupId,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await usersService.list({ status: 'active' });
      setUsers(response.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchGroupDetails = useCallback(async () => {
    if (!groupId) return;

    try {
      setLoading(true);
      const group = await groupsService.getDetails(groupId);
      setName(group.name);
      setDescription(group.description || '');

      const memberUsers = await Promise.all(
        group.members.map(async member => {
          const userDetails = await usersService.getDetails(member.id);
          return userDetails;
        }),
      );

      setSelectedUsers(memberUsers);
    } catch (error) {
      console.error('Error fetching group:', error);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    if (open) {
      fetchUsers();
      if (groupId) {
        fetchGroupDetails();
      } else {
        setName('');
        setDescription('');
        setSelectedUsers([]);
      }
    }
  }, [open, groupId, fetchGroupDetails]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      userIds: selectedUsers.map(user => user.id),
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>{groupId ? 'Editar Grupo' : 'Novo Grupo'}</DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nome do Grupo"
          fullWidth
          required
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <TextField
          margin="dense"
          label="Descrição"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <Autocomplete
          multiple
          options={users}
          getOptionLabel={option => option.username}
          value={selectedUsers}
          onChange={(_, newValue) => setSelectedUsers(newValue)}
          renderInput={params => (
            <TextField {...params} label="Usuários" margin="dense" />
          )}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
