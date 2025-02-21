// Path: types\geographic.ts
import type { Geometry } from 'geojson';

export interface ZoneListResponse {
  zones: ZoneWithStats[];
  total: number;
  page: number;
  limit: number;
}

export interface ZoneWithStats {
  id: string;
  name: string;
  description?: string;
  area_km2: number;
  user_count: number;
  group_count: number;
  created_at: Date;
  created_by: string;
  geom: Geometry;
}

export interface ZonePermissions {
  zone_id: string;
  zone_name: string;
  user_permissions: Array<{
    id: string;
    username: string;
  }>;
  group_permissions: Array<{
    id: string;
    name: string;
  }>;
}

export interface CreateZoneRequest {
  name: string;
  description?: string;
  geom: Geometry;
  userIds?: string[];
  groupIds?: string[];
}

export interface UpdateZonePermissionsRequest {
  userIds?: string[];
  groupIds?: string[];
}

export interface ZoneFormData {
  name: string;
  description?: string;
  geom: string; // GeoJSON as string for form input
  userIds: string[];
  groupIds: string[];
}

export interface ZoneListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: keyof ZoneWithStats;
  order?: 'asc' | 'desc';
}
