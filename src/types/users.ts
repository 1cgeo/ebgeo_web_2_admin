// Path: types\users.ts
export type UserStatus = 'active' | 'inactive' | 'all';
export type UserRole = 'admin' | 'user' | 'all';
export type SortableFields =
  | 'username'
  | 'email'
  | 'role'
  | 'created_at'
  | 'last_login'
  | 'group_count'
  | 'nome_completo'
  | 'nome_guerra'
  | 'organizacao_militar'
  | 'is_active';

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  sort?: SortableFields;
  order?: 'asc' | 'desc';
}

export interface User {
  id: string;
  username: string;
  email: string;
  nome_completo?: string;
  nome_guerra?: string;
  organizacao_militar?: string;
  role: 'admin' | 'user';
  isActive: boolean;
  lastLogin?: Date;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDetails extends User {
  groupCount: number;
  groups: UserGroup[];
  apiKeys: ApiKeyInfo[];
  permissions: UserPermissions;
}

export interface UserGroup {
  id: string;
  name: string;
  addedAt: Date;
  addedBy: string;
}

export interface ApiKeyInfo {
  key: string;
  createdAt: Date;
  revokedAt?: Date;
  isActive: boolean;
}

export interface UserPermissions {
  models: {
    count: number;
    items: Array<{
      id: string;
      name: string;
      accessType: 'direct' | 'group';
      groupId?: string;
    }>;
  };
  zones: {
    count: number;
    items: Array<{
      id: string;
      name: string;
      accessType: 'direct' | 'group';
      groupId?: string;
    }>;
  };
}

export interface CreateUserDTO {
  username: string;
  email: string;
  nome_completo?: string;
  nome_guerra?: string;
  organizacao_militar?: string;
  password: string;
  role: 'admin' | 'user';
  groupIds?: string[];
}

export interface UpdateUserDTO {
  email?: string;
  nome_completo?: string;
  nome_guerra?: string;
  organizacao_militar?: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
}

export interface UpdateProfileDTO {
  email: string;
  nome_completo?: string;
  nome_guerra?: string;
  organizacao_militar?: string;
}

export interface UserListResponse {
  users: Array<User & { groupCount: number }>;
  total: number;
  page: number;
  limit: number;
}

export interface FilterState {
  search: string;
  role: 'all' | 'admin' | 'user';
  status: 'all' | 'active' | 'inactive';
  organizacao?: string;
}

export interface FormData extends Omit<CreateUserDTO, 'groupIds'> {
  confirmPassword: string;
  groupIds: string[];
}

export type UserTableItem = User & {
  groupCount: number;
};
