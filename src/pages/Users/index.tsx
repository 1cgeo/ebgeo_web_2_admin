import React from 'react';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import { PageContainer } from '@/components/Layout/PageContainer';
import { PageHeader } from '@/components/Layout/PageHeader';
import { UsersTable } from './components/UsersTable';
import { UsersFilterBar } from './components/UsersFilterBar';
import { UserDialog } from './components/UserDialog';
import { UserDetailsDialog } from './components/UserDetailsDialog';
import { DeleteUserDialog } from './components/DeleteUserDialog';
import { useUsers } from './hooks/useUsers';
import type { FormData } from '@/types/users';
import type { UserDetails } from '@/types/users';
import type { AxiosError } from 'axios';

interface ApiErrorResponse {
  status?: number;
}

const UsersPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
  const [selectedUser, setSelectedUser] = React.useState<UserDetails | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const {
    users,
    totalCount,
    page,
    rowsPerPage,
    loading,
    filters,
    sortField,
    sortOrder,
    createUser,
    updateUser,
    toggleUserStatus,
    getUserDetails,
    handlePageChange,
    handleRowsPerPageChange,
    handleFilterChange,
    handleSort,
    refetchUsers
  } = useUsers();

  const handleCreate = () => {
    setSelectedUserId(null);
    setDialogOpen(true);
  };

  const handleEdit = (id: string) => {
    setSelectedUserId(id);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedUserId(id);
    setDeleteDialogOpen(true);
  };

  const handleViewDetails = async (id: string) => {
    try {
      const userDetails = await getUserDetails(id);
      setSelectedUser(userDetails);
      setDetailsDialogOpen(true);
    } catch {
      enqueueSnackbar('Erro ao carregar detalhes do usuário', { variant: 'error' });
    }
  };

  const handleSubmit = async (data: FormData) => {
    try {
      if (selectedUserId) {
        await updateUser(selectedUserId, data);
        enqueueSnackbar('Usuário atualizado com sucesso', { variant: 'success' });
      } else {
        await createUser(data);
        enqueueSnackbar('Usuário criado com sucesso', { variant: 'success' });
      }
      setDialogOpen(false);
      await refetchUsers();
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.status === 409) {
        enqueueSnackbar('Já existe um usuário com este nome/email', { variant: 'error' });
      } else {
        enqueueSnackbar('Erro ao salvar usuário', { variant: 'error' });
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUserId) return;

    try {
      await toggleUserStatus(selectedUserId);
      enqueueSnackbar('Status do usuário alterado com sucesso', { variant: 'success' });
      setDeleteDialogOpen(false);
      await refetchUsers();
    } catch {
      enqueueSnackbar('Erro ao alterar status do usuário', { variant: 'error' });
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Usuários"
        subtitle="Gerencie os usuários do sistema"
        actions={
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={loading}
          >
            Novo Usuário
          </Button>
        }
      />

      <UsersFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <Box sx={{ mt: 3 }}>
        <UsersTable
          users={users}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          loading={loading}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>

      <UserDialog
        open={dialogOpen}
        userId={selectedUserId}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />

      <UserDetailsDialog
        open={detailsDialogOpen}
        user={selectedUser}
        onClose={() => setDetailsDialogOpen(false)}
      />

      <DeleteUserDialog
        open={deleteDialogOpen}
        user={selectedUser}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </PageContainer>
  );
};

export default UsersPage;