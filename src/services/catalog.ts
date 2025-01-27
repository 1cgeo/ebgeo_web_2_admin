import { api } from './api';
import type {
  ModelPermissionsListResponse,
  ModelPermissions,
  UpdateModelPermissionsRequest,
  ModelPermissionsQueryParams
} from '@/types/catalog';

export const catalogService = {
  async listPermissions(params: ModelPermissionsQueryParams): Promise<ModelPermissionsListResponse> {
    const { data } = await api.get('/api/catalog3d/permissions', { params });
    return data;
  },

  async getPermissions(modelId: string): Promise<ModelPermissions> {
    const { data } = await api.get(`/api/catalog3d/permissions/${modelId}`);
    return data;
  },

  async updatePermissions(modelId: string, permissions: UpdateModelPermissionsRequest): Promise<void> {
    await api.put(`/api/catalog3d/permissions/${modelId}`, permissions);
  }
};