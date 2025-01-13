import React, { useState } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  IconButton,
  Button,
  Dialog,
  TextField,
  Autocomplete,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Public as PublicIcon,
  Lock as PrivateIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import usePermissions from '../hooks/usePermissions';

// TabPanel component for tabs
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

// Dialog para editar permissões
const PermissionDialog = ({ 
  open, 
  onClose, 
  item, 
  type,
  onSave,
  loading 
}) => {
  const [accessLevel, setAccessLevel] = useState(item?.access_level || 'public');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [userSearchValue, setUserSearchValue] = useState('');
  const [groupSearchValue, setGroupSearchValue] = useState('');
  const [userOptions, setUserOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const [searching, setSearching] = useState(false);

  const searchUsers = async (search) => {
    if (!search) return;
    setSearching(true);
    try {
      const response = await fetch(`/api/admin/users/search?q=${search}`);
      const data = await response.json();
      setUserOptions(data.users);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearching(false);
    }
  };

  const searchGroups = async (search) => {
    if (!search) return;
    setSearching(true);
    try {
      const response = await fetch(`/api/admin/groups/search?q=${search}`);
      const data = await response.json();
      setGroupOptions(data.groups);
    } catch (error) {
      console.error('Error searching groups:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSave = () => {
    onSave({
      id: item.id,
      access_level: accessLevel,
      userIds: selectedUsers.map(u => u.id),
      groupIds: selectedGroups.map(g => g.id)
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Editar Permissões - {item?.name}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Nível de Acesso
          </Typography>
          <Button
            variant={accessLevel === 'public' ? 'contained' : 'outlined'}
            startIcon={<PublicIcon />}
            onClick={() => setAccessLevel('public')}
            sx={{ mr: 1 }}
          >
            Público
          </Button>
          <Button
            variant={accessLevel === 'private' ? 'contained' : 'outlined'}
            startIcon={<PrivateIcon />}
            onClick={() => setAccessLevel('private')}
          >
            Privado
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Usuários com Acesso
          </Typography>
          <Autocomplete
            multiple
            value={selectedUsers}
            onChange={(_, newValue) => setSelectedUsers(newValue)}
            options={userOptions}
            getOptionLabel={(option) => option.username}
            inputValue={userSearchValue}
            onInputChange={(_, newValue) => {
              setUserSearchValue(newValue);
              searchUsers(newValue);
            }}
            loading={searching}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Buscar usuários..."
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {searching ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.username}
                  {...getTagProps({ index })}
                />
              ))
            }
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Grupos com Acesso
          </Typography>
          <Autocomplete
            multiple
            value={selectedGroups}
            onChange={(_, newValue) => setSelectedGroups(newValue)}
            options={groupOptions}
            getOptionLabel={(option) => option.name}
            inputValue={groupSearchValue}
            onInputChange={(_, newValue) => {
              setGroupSearchValue(newValue);
              searchGroups(newValue);
            }}
            loading={searching}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Buscar grupos..."
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {searching ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.name}
                  {...getTagProps({ index })}
                />
              ))
            }
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

const PermissionsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const {
    models,
    zones,
    loading,
    error,
    updateModelPermissions,
    updateZonePermissions
  } = usePermissions();

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  const handleEditPermissions = (item, type) => {
    setSelectedItem({ ...item, type });
    setDialogOpen(true);
  };

  const handleSavePermissions = async (data) => {
    try {
      if (selectedItem.type === 'model') {
        await updateModelPermissions(data);
      } else {
        await updateZonePermissions(data);
      }
      
      enqueueSnackbar('Permissões atualizadas com sucesso', { variant: 'success' });
      setDialogOpen(false);
    } catch (error) {
      enqueueSnackbar(error.message || 'Erro ao atualizar permissões', { variant: 'error' });
    }
  };

  if (error) {
    return (
      <Typography color="error">
        Erro ao carregar permissões: {error.message}
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Permissões
      </Typography>

      <Paper>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Modelos 3D" />
          <Tab label="Zonas Geográficas" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {models.map((model) => (
                <ListItem
                  key={model.id}
                  divider
                  secondaryAction={
                    <IconButton 
                      onClick={() => handleEditPermissions(model, 'model')}
                    >
                      <EditIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={model.name}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {model.access_level === 'public' ? (
                          <PublicIcon fontSize="small" />
                        ) : (
                          <PrivateIcon fontSize="small" />
                        )}
                        {model.access_level === 'public' ? 'Público' : 'Privado'}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {zones.map((zone) => (
                <ListItem
                  key={zone.id}
                  divider
                  secondaryAction={
                    <IconButton 
                      onClick={() => handleEditPermissions(zone, 'zone')}
                    >
                      <EditIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={zone.name}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {zone.access_level === 'public' ? (
                          <PublicIcon fontSize="small" />
                        ) : (
                          <PrivateIcon fontSize="small" />
                        )}
                        {zone.access_level === 'public' ? 'Público' : 'Privado'}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>
      </Paper>

      <PermissionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        item={selectedItem}
        type={selectedItem?.type}
        onSave={handleSavePermissions}
        loading={loading}
      />
    </Box>
  );
};

export default PermissionsPage;