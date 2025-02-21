// Path: services\logs.ts
import type { LogQueryParams, LogResponse } from '@/types/logs';

import { api } from './api';

export const logsService = {
  async query(params: LogQueryParams): Promise<LogResponse> {
    const { data } = await api.get('/api/admin/logs', { params });
    return data;
  },
};
