import { api } from './api';
import type { AuditResponse, AuditFilters } from '@/types/audit';

export const auditService = {
  async query(filters: AuditFilters): Promise<AuditResponse> {
    const { data } = await api.get('/api/admin/audit', { params: filters });
    return data;
  }
};