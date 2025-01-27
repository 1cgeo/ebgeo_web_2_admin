// Enums - não usar 'type' na importação
export enum ModelAccessLevel {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

// Base types
export interface Catalog3D {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  url: string;
  lon?: number;
  lat?: number;
  height?: number;
  heading?: number;
  pitch?: number;
  roll?: number;
  type: string;
  heightoffset?: number;
  maximumscreenspaceerror?: number;
  data_criacao: Date;
  data_carregamento: Date;
  municipio?: string;
  estado?: string;
  palavras_chave?: string[];
  access_level: ModelAccessLevel;
}

// Permission types
export interface BasePermission {
  id: string;
  username?: string;
  name?: string;
}

export interface ModelPermission extends BasePermission {
  type: string;
  access_level: ModelAccessLevel;
}

export interface ModelPermissions {
  model_id: string;
  model_name: string;
  access_level: ModelAccessLevel;
  user_permissions: BasePermission[];
  group_permissions: BasePermission[];
}

export interface ModelPermissionsSummary {
  model_id: string;
  model_name: string;
  model_type: string;
  access_level: ModelAccessLevel;
  data_carregamento: Date;
  user_count: number;
  group_count: number;
  users: BasePermission[];
  groups: BasePermission[];
}

// API Request/Response types
export interface UpdateModelPermissionsRequest {
  access_level?: ModelAccessLevel;
  userIds?: string[];
  groupIds?: string[];
}

export interface ModelPermissionsListResponse {
  models: ModelPermissionsSummary[];
  total: number;
  page: number;
  limit: number;
}

// Form and query types
export interface ModelPermissionsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: keyof ModelPermissionsSummary;
  order?: 'asc' | 'desc';
  access_level?: ModelAccessLevel;
  model_type?: string;
}

export interface ModelPermissionsFormData {
  access_level: ModelAccessLevel;
  userIds: string[];
  groupIds: string[];
}