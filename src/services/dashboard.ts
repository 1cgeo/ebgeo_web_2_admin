import { api } from './api';
import { SystemHealth, SystemMetrics } from '@/types/admin';

export const dashboardService = {
  async getHealth(): Promise<SystemHealth> {
    const { data } = await api.get('/api/admin/health');
    return data;
  },

  async getMetrics(): Promise<SystemMetrics> {
    const { data } = await api.get('/api/admin/metrics');
    return data;
  }
};