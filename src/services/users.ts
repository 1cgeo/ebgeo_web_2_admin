// Path: services\users.ts
import type {
  CreateUserDTO,
  ListParams,
  UpdateUserDTO,
  UserDetails,
  UserListResponse,
} from '@/types/users';

import { api } from './api';

export const usersService = {
  async list(params: ListParams): Promise<UserListResponse> {
    const { data } = await api.get('/api/users', { params });
    return data;
  },

  async getDetails(id: string): Promise<UserDetails> {
    const { data } = await api.get(`/api/users/${id}`);
    return data;
  },

  async create(userData: CreateUserDTO): Promise<UserDetails> {
    const { data } = await api.post('/api/users', userData);
    return data;
  },

  async update(id: string, userData: UpdateUserDTO): Promise<UserDetails> {
    const { data } = await api.put(`/api/users/${id}`, userData);
    return data;
  },

  async updatePassword(id: string, newPassword: string): Promise<void> {
    await api.put(`/api/users/${id}/password`, { newPassword });
  },
};
