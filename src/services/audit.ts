import { api } from './api';
import { AuditResponse, AuditQueryParams } from '@/types/admin';

export const auditService = {
  async query(params: AuditQueryParams): Promise<AuditResponse> {
    const { data } = await api.get('/admin/audit', { params });
    return data;
  }
};