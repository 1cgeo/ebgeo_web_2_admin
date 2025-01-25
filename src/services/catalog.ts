import { api } from './api';
import { Catalog3DSearchResponse, ModelPermissions, UpdateModelPermissionsRequest } from '@/types/catalog';

interface SearchParams {
  q?: string;
  page?: number;
  nr_records?: number;
}

export const catalogService = {
  async search(params: SearchParams): Promise<Catalog3DSearchResponse> {
    const { data } = await api.get('/api/catalog3d/catalogo3d', { params });
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