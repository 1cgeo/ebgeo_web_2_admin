import { api } from './api';
import type {
  ZoneWithStats,
  ZonePermissions,
  CreateZoneRequest,
  UpdateZonePermissionsRequest,
  ZoneListParams,
  ZoneListResponse
} from '@/types/geographic';

export const zonesService = {
  async list(params: ZoneListParams): Promise<ZoneListResponse> {
    const { data } = await api.get('/api/geographic/zones', { params });
    return {
      ...data,
      zones: data.zones.map((zone: ZoneWithStats) => ({
        ...zone,
        created_at: new Date(zone.created_at)
      }))
    };
  },

  async getDetails(id: string): Promise<ZoneWithStats> {
    const { data } = await api.get(`/api/geographic/zones/${id}`);
    return {
      ...data,
      created_at: new Date(data.created_at)
    };
  },

  async create(zoneData: CreateZoneRequest): Promise<ZoneWithStats> {
    const { data } = await api.post('/api/geographic/zones', zoneData);
    return {
      ...data,
      created_at: new Date(data.created_at)
    };
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/geographic/zones/${id}`);
  },

  async getPermissions(id: string): Promise<ZonePermissions> {
    const { data } = await api.get(`/api/geographic/zones/${id}/permissions`);
    return data;
  },

  async updatePermissions(id: string, permissions: UpdateZonePermissionsRequest): Promise<void> {
    await api.put(`/api/geographic/zones/${id}/permissions`, permissions);
  }
};