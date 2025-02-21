// Path: types\groups.ts
export interface ModelPermission {
  id: string;
  name: string;
  type: string;
  access_level: 'public' | 'private';
}

export interface ZonePermission {
  id: string;
  name: string;
  area_km2: number;
}

export interface GroupMember {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  addedAt: string;
  addedBy: string;
}

export interface GroupDetails {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_by_name: string;
  created_at: Date;
  updated_at: Date;
  member_count: number;
  model_permissions_count: number;
  zone_permissions_count: number;
  members: GroupMember[];
  model_permissions: ModelPermission[];
  zone_permissions: ZonePermission[];
}

export interface GroupFormData {
  name: string;
  description?: string;
  userIds: string[];
}

export interface CreateGroupDTO extends GroupFormData {}

export interface UpdateGroupDTO extends GroupFormData {}

export interface GroupListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: keyof GroupDetails;
  order?: 'asc' | 'desc';
}

export interface GroupList {
  groups: GroupDetails[];
  total: number;
  page: number;
  limit: number;
}
