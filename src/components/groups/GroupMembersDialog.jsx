import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  IconButton,
  Typography,
  TextField,
  Box,
  Autocomplete,
  Avatar,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';
import useGroupMembers from '../../hooks/useGroupMembers';

const GroupMembersDialog = ({ open, onClose, group }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchUsers, setSearchUsers] = useState('');
  const [loading, setLoading] = useState(false);
  const [userOptions, setUserOptions] = useState([]);

  const { 
    members, 
    totalMembers,
    addMember,
    removeMember,
    loading: membersLoading,
    error
  } = useGroupMembers(group?.id);

  // Buscar usuários para adicionar ao grupo
  const searchAvailableUsers = async (search) => {
    if (!search) {
      setUserOptions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/search?q=${search}&excludeGroup=${group.id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setUserOptions(data.users);
    } catch (error) {
      console.error('Error searching users:', error);
      enqueueSnackbar(
        'Erro ao buscar usuários',
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  // Debounce da busca de usuários
  React.useEffect(() => {
    const timer = setTimeout(() => {
      searchAvailableUsers(searchUsers);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchUsers]);

  const handleAddMember = async () => {
    if (!selectedUser) return;

    try {
      await addMember(selectedUser.id);
      setSelectedUser(null);
      enqueueSnackbar('Membro adicionado com sucesso', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(
        error.message || 'Erro ao adicionar membro',
        { variant: 'error' }
      );
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm('Tem certeza que deseja remover este membro do grupo?')) {
      return;
    }

    try {
      await removeMember(userId);
      enqueueSnackbar('Membro removido com sucesso', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(
        error.message || 'Erro ao remover membro',
        { variant: 'error' }
      );
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Membros do Grupo - {group?.name}
      </DialogTitle>

      <DialogContent>
        {/* Adicionar Membro */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
          <Autocomplete
            fullWidth
            value={selectedUser}
            onChange={(_, newValue) => setSelectedUser(newValue)}
            options={userOptions}
            getOptionLabel={(option) => option.username}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            inputValue={searchUsers}
            onInputChange={(_, newValue) => setSearchUsers(newValue)}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Adicionar membro"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar sx={{ width: 24, height: 24 }}>
                    {option.username[0].toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography>{option.username}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.email}
                    </Typography>
                  </Box>
                </Box>
              </li>
            )}
          />
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleAddMember}
            disabled={!selectedUser}
          >
            Adicionar
          </Button>
        </Box>

        {/* Lista de Membros */}
        {error ? (
          <Typography color="error">
            Erro ao carregar membros: {error.message}
          </Typography>
        ) : membersLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {totalMembers} membro{totalMembers === 1 ? '' : 's'}
            </Typography>

            <List>
              {members.map((member) => (
                <ListItem
                  key={member.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveMember(member.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24 }}>
                          {member.username[0].toUpperCase()}
                        </Avatar>
                        <Typography>{member.username}</Typography>
                        <Chip
                          label={member.role}
                          size="small"
                          color={member.role === 'admin' ? 'primary' : 'default'}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        {member.email}
                        <br />
                        Adicionado em: {format(new Date(member.addedAt), 'dd/MM/yyyy HH:mm')}
                        {member.addedBy && ` por ${member.addedBy}`}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupMembersDialog;