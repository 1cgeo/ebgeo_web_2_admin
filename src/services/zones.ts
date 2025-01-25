import { api } from './api';
import { ZoneWithStats, ZonePermissions, CreateZoneRequest, UpdateZonePermissionsRequest } from '@/types/geographic';

export const zonesService = {
  async list(): Promise<ZoneWithStats[]> {
    const { data } = await api.get('/api/geographic/zones');
    return data;
  },

  async create(zoneData: CreateZoneRequest): Promise<ZoneWithStats> {
    const { data } = await api.post('/api/geographic/zones', zoneData);
    return data;
  },

  async getPermissions(zoneId: string): Promise<ZonePermissions> {
    const { data } = await api.get(`/api/geographic/zones/${zoneId}/permissions`);
    return data;
  },

  async updatePermissions(zoneId: string, permissions: UpdateZonePermissionsRequest): Promise<void> {
    await api.put(`/api/geographic/zones/${zoneId}/permissions`, permissions);
  }
};