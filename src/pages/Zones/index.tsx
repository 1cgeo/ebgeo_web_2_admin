// Path: pages\Zones\index.tsx
import { Box, Button } from '@mui/material';
import type { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';

import React from 'react';

import { PageContainer } from '@/components/Layout/PageContainer';
import { PageHeader } from '@/components/Layout/PageHeader';

import type {
  ZoneFormData,
  ZonePermissions,
  ZoneWithStats,
} from '@/types/geographic';

import { DeleteZoneDialog } from './components/DeleteZoneDialog';
import { ZoneDetailsDialog } from './components/ZoneDetailsDialog';
import { ZoneDialog } from './components/ZoneDialog';
import { ZonesFilterBar } from './components/ZonesFilterBar';
import { ZonesTable } from './components/ZonesTable';
import { useZones } from './hooks/useZones';

interface ApiErrorResponse {
  status?: number;
}

const ZonesPage: React.FC = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedZoneId, setSelectedZoneId] = React.useState<string | null>(
    null,
  );
  const [selectedZone, setSelectedZone] = React.useState<ZoneWithStats | null>(
    null,
  );
  const [selectedPermissions, setSelectedPermissions] =
    React.useState<ZonePermissions | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const {
    zones,
    totalCount,
    page,
    rowsPerPage,
    loading,
    search,
    sortField,
    sortOrder,
    createZone,
    deleteZone,
    getZoneDetails,
    getZonePermissions,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearch,
    handleSort,
    refetchZones,
  } = useZones();

  const handleCreate = () => {
    setSelectedZoneId(null);
    setDialogOpen(true);
  };

  const handleEdit = (id: string) => {
    setSelectedZoneId(id);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedZoneId(id);
    setDeleteDialogOpen(true);
  };

  const handleViewDetails = async (id: string) => {
    try {
      const [zoneDetails, permissions] = await Promise.all([
        getZoneDetails(id),
        getZonePermissions(id),
      ]);
      setSelectedZone(zoneDetails);
      setSelectedPermissions(permissions);
      setDetailsDialogOpen(true);
    } catch {
      enqueueSnackbar('Erro ao carregar detalhes da zona', {
        variant: 'error',
      });
    }
  };

  const handleSubmit = async (data: ZoneFormData) => {
    try {
      const geomData = JSON.parse(data.geom);
      const zoneData = {
        ...data,
        geom: geomData,
      };

      await createZone(zoneData);
      enqueueSnackbar('Zona geográfica criada com sucesso', {
        variant: 'success',
      });
      setDialogOpen(false);
      await refetchZones();
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.status === 409) {
        enqueueSnackbar('Já existe uma zona com este nome', {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Erro ao salvar zona', { variant: 'error' });
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedZoneId) return;

    try {
      await deleteZone(selectedZoneId);
      enqueueSnackbar('Zona removida com sucesso', { variant: 'success' });
      setDeleteDialogOpen(false);
      await refetchZones();
    } catch {
      enqueueSnackbar('Erro ao remover zona', { variant: 'error' });
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Zonas Geográficas"
        subtitle="Gerencie as zonas geográficas do sistema"
        actions={
          <Button variant="contained" onClick={handleCreate} disabled={loading}>
            Nova Zona
          </Button>
        }
      />

      <ZonesFilterBar search={search} onSearch={handleSearch} />

      <Box sx={{ mt: 3 }}>
        <ZonesTable
          zones={zones}
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

      <ZoneDialog
        open={dialogOpen}
        zoneId={selectedZoneId}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />

      <ZoneDetailsDialog
        open={detailsDialogOpen}
        zone={selectedZone}
        permissions={selectedPermissions}
        onClose={() => setDetailsDialogOpen(false)}
      />

      <DeleteZoneDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </PageContainer>
  );
};

export default ZonesPage;
