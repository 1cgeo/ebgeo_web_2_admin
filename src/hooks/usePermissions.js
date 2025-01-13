import useSWR from 'swr';
import { useCallback } from 'react';
import api from '../services/api';

const usePermissions = () => {
  // Buscar modelos e zonas com suas permissões
  const {
    data: modelsData,
    error: modelsError,
    mutate: mutateModels
  } = useSWR(
    '/catalog3d/permissions',
    async () => {
      const response = await api.get('/catalog3d/catalogo3d');
      return response.data.data.map(model => ({
        id: model.id,
        name: model.name,
        access_level: model.access_level,
        permissions: {}  // Será preenchido ao buscar permissões específicas
      }));
    }
  );

  const {
    data: zonesData,
    error: zonesError,
    mutate: mutateZones
  } = useSWR(
    '/geographic/zones',
    async () => {
      const response = await api.get('/geographic/zones');
      return response.data.data.map(zone => ({
        id: zone.id,
        name: zone.name,
        access_level: zone.access_level,
        permissions: {}  // Será preenchido ao buscar permissões específicas
      }));
    }
  );

  // Buscar permissões específicas ao clicar em editar
  const getModelPermissions = useCallback(async (modelId) => {
    const response = await api.get(`/catalog3d/permissions/${modelId}`);
    return response.data;
  }, []);

  const getZonePermissions = useCallback(async (zoneId) => {
    const response = await api.get(`/geographic/zones/${zoneId}/permissions`);
    return response.data;
  }, []);

  // Atualizar permissões
  const updateModelPermissions = useCallback(async ({
    id,
    access_level,
    userIds,
    groupIds
  }) => {
    try {
      await api.put(`/catalog3d/permissions/${id}`, {
        access_level,
        userIds,
        groupIds
      });
      mutateModels();
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar permissões do modelo');
    }
  }, [mutateModels]);

  const updateZonePermissions = useCallback(async ({
    id,
    access_level,
    userIds,
    groupIds
  }) => {
    try {
      await api.put(`/geographic/zones/${id}/permissions`, {
        access_level,
        userIds,
        groupIds
      });
      mutateZones();
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar permissões da zona');
    }
  }, [mutateZones]);

    const error = modelsError || zonesError;
  const loading = (!modelsData && !modelsError) || (!zonesData && !zonesError);

  return {
    models: modelsData || [],
    zones: zonesData || [],
    loading,
    error,
    getModelPermissions,
    getZonePermissions,
    updateModelPermissions,
    updateZonePermissions,
    refresh: async () => {
      await Promise.all([mutateModels(), mutateZones()]);
    }
  };
};

export default usePermissions;