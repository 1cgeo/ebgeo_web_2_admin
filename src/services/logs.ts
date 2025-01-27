import { api } from './api';
import type { LogResponse, LogQueryParams } from '@/types/logs';

export const logsService = {
  async query(params: LogQueryParams): Promise<LogResponse> {
    const { data } = await api.get('/api/admin/logs', { params });
    return data;
  }
};