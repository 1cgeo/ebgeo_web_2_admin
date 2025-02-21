// Path: pages\Catalog\index.tsx
import { Box } from '@mui/material';
import type { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';

import React from 'react';

import { PageContainer } from '@/components/Layout/PageContainer';
import { PageHeader } from '@/components/Layout/PageHeader';

import type {
  ModelPermissions,
  ModelPermissionsFormData,
} from '@/types/catalog';

import { ModelPermissionsDialog } from './components/ModelPermissionsDialog';
import { ModelPermissionsFilterBar } from './components/ModelPermissionsFilterBar';
import { ModelPermissionsTable } from './components/ModelPermissionsTable';
import { useModelPermissions } from './hooks/useModelPermissions';

interface ApiErrorResponse {
  status?: number;
  message?: string;
}

const CatalogPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedModelId, setSelectedModelId] = React.useState<string | null>(
    null,
  );
  const [selectedModel, setSelectedModel] =
    React.useState<ModelPermissions | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const {
    models,
    totalCount,
    page,
    rowsPerPage,
    loading,
    search,
    sortField,
    sortOrder,
    accessLevelFilter,
    typeFilter,
    getModelPermissions,
    updateModelPermissions,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearch,
    handleSort,
    handleAccessLevelFilter,
    handleTypeFilter,
    refetchPermissions,
  } = useModelPermissions();

  const handleEdit = async (id: string) => {
    try {
      const modelPermissions = await getModelPermissions(id);
      setSelectedModel(modelPermissions);
      setSelectedModelId(id);
      setDialogOpen(true);
    } catch {
      enqueueSnackbar('Erro ao carregar permissões do modelo', {
        variant: 'error',
      });
    }
  };

  const handleSubmit = async (data: ModelPermissionsFormData) => {
    if (!selectedModelId) return;

    try {
      await updateModelPermissions(selectedModelId, data);
      enqueueSnackbar('Permissões atualizadas com sucesso', {
        variant: 'success',
      });
      setDialogOpen(false);
      await refetchPermissions();
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.status === 403) {
        enqueueSnackbar('Você não tem permissão para realizar esta ação', {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Erro ao atualizar permissões', {
          variant: 'error',
        });
      }
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Permissões do Catálogo 3D"
        subtitle="Gerencie as permissões de acesso aos modelos 3D"
      />

      <ModelPermissionsFilterBar
        search={search}
        accessLevel={accessLevelFilter}
        modelType={typeFilter}
        loading={loading}
        onSearch={handleSearch}
        onAccessLevelChange={handleAccessLevelFilter}
        onTypeChange={handleTypeFilter}
      />

      <Box sx={{ mt: 3 }}>
        <ModelPermissionsTable
          models={models}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          loading={loading}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={handleEdit}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>

      <ModelPermissionsDialog
        open={dialogOpen}
        modelId={selectedModelId}
        initialData={selectedModel}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
};

export default CatalogPage;
