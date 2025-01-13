import React, { useState } from 'react';
import { 
  Box, 
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Group as GroupIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import GroupForm from '../components/groups/GroupForm';
import GroupMembersDialog from '../components/groups/GroupMembersDialog';
import DeleteConfirmDialog from '../components/common/DeleteConfirmDialog';
import useGroups from '../hooks/useGroups';

const GroupsPage = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const { 
    groups, 
    totalGroups, 
    loading, 
    error,
    createGroup,
    updateGroup,
    deleteGroup
  } = useGroups({
    page: page + 1,
    limit: pageSize,
    search
  });

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleCreateGroup = () => {
    setSelectedGroup(null);
    setFormOpen(true);
  };

  const handleEditGroup = (group) => {
    setSelectedGroup(group);
    setFormOpen(true);
  };

  const handleViewMembers = (group) => {
    setSelectedGroup(group);
    setMembersDialogOpen(true);
  };

  const handleDelete = (group) => {
    setSelectedGroup(group);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteGroup(selectedGroup.id);
      enqueueSnackbar('Grupo excluído com sucesso', { variant: 'success' });
      setDeleteDialogOpen(false);
    } catch (error) {
      enqueueSnackbar(
        error.message || 'Erro ao excluir grupo',
        { variant: 'error' }
      );
    }
  };

  const columns = [
    { 
      field: 'name', 
      headerName: 'Nome', 
      flex: 1 
    },
    { 
      field: 'description', 
      headerName: 'Descrição', 
      flex: 2 
    },
    {
      field: 'memberCount',
      headerName: 'Membros',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value > 0 ? 'primary' : 'default'}
          size="small"
        />
      )
    },
    { 
      field: 'createdAt', 
      headerName: 'Criado em', 
      width: 180,
      valueFormatter: (params) => 
        new Date(params.value).toLocaleString()
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Editar">
            <IconButton onClick={() => handleEditGroup(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Membros">
            <IconButton onClick={() => handleViewMembers(params.row)}>
              <GroupIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton 
              onClick={() => handleDelete(params.row)}
              color="error"
            >
              <DeleteIcon />
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
          Erro ao carregar grupos: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Grupos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateGroup}
        >
          Novo Grupo
        </Button>
      </Box>

      <Paper sx={{ mb: 2, p: 2 }}>
        <TextField
          fullWidth
          label="Buscar grupos"
          variant="outlined"
          value={search}
          onChange={handleSearch}
          sx={{ mb: 2 }}
        />

        <DataGrid
          rows={groups || []}
          columns={columns}
          pagination
          paginationMode="server"
          page={page}
          pageSize={pageSize}
          rowCount={totalGroups}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          loading={loading}
          disableSelectionOnClick
          autoHeight
        />
      </Paper>

      {/* Modal de Criação/Edição de Grupo */}
      <GroupForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        group={selectedGroup}
        onSubmit={selectedGroup ? updateGroup : createGroup}
      />

      {/* Modal de Gerenciamento de Membros */}
      <GroupMembersDialog
        open={membersDialogOpen}
        onClose={() => setMembersDialogOpen(false)}
        group={selectedGroup}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Grupo"
        message={`Tem certeza que deseja excluir o grupo "${selectedGroup?.name}"? Esta ação não pode ser desfeita.`}
      />
    </Box>
  );
};

export default GroupsPage;