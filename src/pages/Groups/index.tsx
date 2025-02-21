// Path: pages\Groups\index.tsx
import { Box, Button } from '@mui/material';
import type { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';

import React from 'react';

import { PageContainer } from '@/components/Layout/PageContainer';
import { PageHeader } from '@/components/Layout/PageHeader';

import type { GroupDetails, GroupFormData } from '@/types/groups';

import { DeleteGroupDialog } from './components/DeleteGroupDialog';
import { GroupDetailsDialog } from './components/GroupDetailsDialog';
import { GroupDialog } from './components/GroupDialog';
import { GroupsFilterBar } from './components/GroupsFilterBar';
import { GroupsTable } from './components/GroupsTable';
import { useGroups } from './hooks/useGroups';

interface ApiErrorResponse {
  status?: number;
}

const GroupsPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedGroupId, setSelectedGroupId] = React.useState<string | null>(
    null,
  );
  const [selectedGroup, setSelectedGroup] = React.useState<GroupDetails | null>(
    null,
  );
  const { enqueueSnackbar } = useSnackbar();

  const {
    groups,
    totalCount,
    page,
    rowsPerPage,
    tableLoading,
    search,
    sortField,
    sortOrder,
    createGroup,
    updateGroup,
    deleteGroup,
    getGroupDetails,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearch,
    handleSort,
    refetchGroups,
  } = useGroups();

  const handleCreate = () => {
    setSelectedGroupId(null);
    setDialogOpen(true);
  };

  const handleEdit = (id: string) => {
    setSelectedGroupId(id);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedGroupId(id);
    setDeleteDialogOpen(true);
  };

  const handleViewDetails = async (id: string) => {
    try {
      const groupDetails = await getGroupDetails(id);
      setSelectedGroup(groupDetails);
      setDetailsDialogOpen(true);
    } catch {
      enqueueSnackbar('Erro ao carregar detalhes do grupo', {
        variant: 'error',
      });
    }
  };

  const handleSubmit = async (data: GroupFormData) => {
    try {
      if (selectedGroupId) {
        await updateGroup(selectedGroupId, data);
        enqueueSnackbar('Grupo atualizado com sucesso', { variant: 'success' });
      } else {
        await createGroup(data);
        enqueueSnackbar('Grupo criado com sucesso', { variant: 'success' });
      }
      setDialogOpen(false);
      await refetchGroups();
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.status === 409) {
        enqueueSnackbar('Já existe um grupo com este nome', {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Erro ao salvar grupo', { variant: 'error' });
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedGroupId) return;

    try {
      await deleteGroup(selectedGroupId);
      enqueueSnackbar('Grupo removido com sucesso', { variant: 'success' });
      setDeleteDialogOpen(false);
      await refetchGroups();
    } catch {
      enqueueSnackbar('Erro ao remover grupo', { variant: 'error' });
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Grupos"
        subtitle="Gerencie os grupos de usuários do sistema"
        actions={
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={tableLoading}
          >
            Novo Grupo
          </Button>
        }
      />

      <GroupsFilterBar search={search} onSearch={handleSearch} />

      <Box sx={{ mt: 3 }}>
        <GroupsTable
          groups={groups}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          loading={tableLoading}
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

      <GroupDialog
        open={dialogOpen}
        groupId={selectedGroupId}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />

      <GroupDetailsDialog
        open={detailsDialogOpen}
        group={selectedGroup}
        onClose={() => setDetailsDialogOpen(false)}
      />

      <DeleteGroupDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </PageContainer>
  );
};

export default GroupsPage;
