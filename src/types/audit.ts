// Path: types\audit.ts
export type AuditAction =
  | 'USER_CREATE'
  | 'USER_UPDATE'
  | 'USER_DELETE'
  | 'USER_ROLE_CHANGE'
  | 'GROUP_CREATE'
  | 'GROUP_UPDATE'
  | 'GROUP_DELETE'
  | 'MODEL_PERMISSION_CHANGE'
  | 'ZONE_PERMISSION_CHANGE'
  | 'API_KEY_REGENERATE'
  | 'ADMIN_LOGIN'
  | 'ADMIN_ACTION';

export type AuditTargetType = 'USER' | 'GROUP' | 'MODEL' | 'ZONE' | 'SYSTEM';

export interface AuditActor {
  id: string;
  username: string;
}

export interface AuditTarget {
  type: AuditTargetType;
  id: string;
  name: string;
}

export interface AuditEntry extends Record<string, unknown> {
  id: string;
  timestamp: string;
  action: AuditAction;
  actor: AuditActor;
  target?: AuditTarget;
  details: Record<string, unknown>;
  ip: string;
  userAgent?: string;
}

export interface AuditFilters {
  startDate?: string;
  endDate?: string;
  action?: AuditAction;
  actorId?: string;
  targetId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AuditResponse {
  entries: AuditEntry[];
  total: number;
  page: number;
  limit: number;
}

export const auditActionLabels: Record<AuditAction, string> = {
  USER_CREATE: 'Criação de Usuário',
  USER_UPDATE: 'Atualização de Usuário',
  USER_DELETE: 'Remoção de Usuário',
  USER_ROLE_CHANGE: 'Alteração de Papel de Usuário',
  GROUP_CREATE: 'Criação de Grupo',
  GROUP_UPDATE: 'Atualização de Grupo',
  GROUP_DELETE: 'Remoção de Grupo',
  MODEL_PERMISSION_CHANGE: 'Alteração de Permissão de Modelo',
  ZONE_PERMISSION_CHANGE: 'Alteração de Permissão de Zona',
  API_KEY_REGENERATE: 'Regeneração de API Key',
  ADMIN_LOGIN: 'Login Administrativo',
  ADMIN_ACTION: 'Ação Administrativa',
};

export const targetTypeLabels: Record<AuditTargetType, string> = {
  USER: 'Usuário',
  GROUP: 'Grupo',
  MODEL: 'Modelo',
  ZONE: 'Zona',
  SYSTEM: 'Sistema',
};
