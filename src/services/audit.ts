// Path: services\audit.ts
import type { AuditFilters, AuditResponse } from '@/types/audit';

import { api } from './api';

export const auditService = {
  async query(filters: AuditFilters): Promise<AuditResponse> {
    const { data } = await api.get('/api/admin/audit', { params: filters });
    return data;
  },
};
