import { api } from './api';
import { LogResponse, LogQueryParams } from '@/types/admin';

export const logsService = {
  async query(params: LogQueryParams): Promise<LogResponse> {
    const { data } = await api.get('/api/admin/logs', { params });
    return data;
  }
};