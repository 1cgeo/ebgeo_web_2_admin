import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Button,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Dialog
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Key as KeyIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import UserForm from '../components/users/UserForm';
import ApiKeyDialog from '../components/users/ApiKeyDialog';
import useUsers from '../hooks/useUsers';

const UsersPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  
  const { enqueueSnackbar } = useSnackbar();
  const { 
    users, 
    totalUsers, 
    loading, 
    error,
    updateUser,
    createUser,
    regenerateApiKey
  } = useUsers({
    page: page + 1,
    limit: pageSize,
    search
  });

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setFormOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormOpen(true);
  };

  const handleApiKey = (user) => {
    setSelectedUser(user);
    setApiKeyDialogOpen(true);
  };

  const handleToggleStatus = async (user) => {
    try {
      await updateUser(user.id, { isActive: !user.isActive });
      enqueueSnackbar(
        `Usuário ${user.isActive ? 'desativado' : 'ativado'} com sucesso`,
        { variant: 'success' }
      );
    } catch (error) {
      enqueueSnackbar(
        error.message || 'Erro ao alterar status do usuário',
        { variant: 'error' }
      );
    }
  };

  const columns = [
    { 
      field: 'username', 
      headerName: 'Usuário', 
      flex: 1 
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      flex: 1.5 
    },
    { 
      field: 'role', 
      headerName: 'Perfil', 
      width: 120,
      valueFormatter: (params) => 
        params.value === 'admin' ? 'Administrador' : 'Usuário'
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ 
          color: params.value ? 'success.main' : 'error.main',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          {params.value ? <ActiveIcon /> : <BlockIcon />}
          {params.value ? 'Ativo' : 'Inativo'}
        </Box>
      )
    },
    { 
      field: 'lastLogin', 
      headerName: 'Último Acesso', 
      width: 180,
      valueFormatter: (params) => 
        params.value ? new Date(params.value).toLocaleString() : 'Nunca'
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Editar">
            <IconButton onClick={() => handleEditUser(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="API Key">
            <IconButton onClick={() => handleApiKey(params.row)}>
              <KeyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.isActive ? 'Desativar' : 'Ativar'}>
            <IconButton onClick={() => handleToggleStatus(params.row)}>
              {params.row.isActive ? <BlockIcon /> : <ActiveIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  if (error) {
    return (
      <Box>
        <Typography color="error">
          Erro ao carregar usuários: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Usuários</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateUser}
        >
          Novo Usuário
        </Button>
      </Box>

      <Paper sx={{ mb: 2, p: 2 }}>
        <TextField
          fullWidth
          label="Buscar usuários"
          variant="outlined"
          value={search}
          onChange={handleSearch}
          sx={{ mb: 2 }}
        />

        <DataGrid
          rows={users || []}
          columns={columns}
          pagination
          paginationMode="server"
          page={page}
          pageSize={pageSize}
          rowCount={totalUsers}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          loading={loading}
          disableSelectionOnClick
          autoHeight
        />
      </Paper>

      {/* Modal de Criação/Edição de Usuário */}
      <UserForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        user={selectedUser}
        onSubmit={selectedUser ? updateUser : createUser}
      />

      {/* Modal de API Key */}
      <ApiKeyDialog
        open={apiKeyDialogOpen}
        onClose={() => setApiKeyDialogOpen(false)}
        user={selectedUser}
        onRegenerate={regenerateApiKey}
      />
    </Box>
  );
};

export default UsersPage;