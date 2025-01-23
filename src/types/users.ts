export interface User {
    id: string;
    username: string;
    email: string;
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
    password: string;
    role: 'admin' | 'user';
    groupIds?: string[];
  }
  
  export interface UpdateUserDTO {
    email?: string;
    role?: 'admin' | 'user';
    isActive?: boolean;
  }
  
  export interface UserListResponse {
    users: Array<User & { groupCount: number }>;
    total: number;
    page: number;
    limit: number;
  }