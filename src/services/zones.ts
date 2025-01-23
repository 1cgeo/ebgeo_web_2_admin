import { api } from './api';
import { ZoneWithStats, ZonePermissions, CreateZoneRequest, UpdateZonePermissionsRequest } from '@/types/geographic';

export const zonesService = {
  async list(): Promise<ZoneWithStats[]> {
    const { data } = await api.get('/geographic/zones');
    return data;
  },

  async create(zoneData: CreateZoneRequest): Promise<ZoneWithStats> {
    const { data } = await api.post('/geographic/zones', zoneData);
    return data;
  },

  async getPermissions(zoneId: string): Promise<ZonePermissions> {
    const { data } = await api.get(`/geographic/zones/${zoneId}/permissions`);
    return data;
  },

  async updatePermissions(zoneId: string, permissions: UpdateZonePermissionsRequest): Promise<void> {
    await api.put(`/geographic/zones/${zoneId}/permissions`, permissions);
  }
};