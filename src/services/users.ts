import { api } from './api';
import { UserListResponse, UserDetails, CreateUserDTO, UpdateUserDTO } from '@/types/users';

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive' | 'all';
  role?: 'admin' | 'user' | 'all';
}

export const usersService = {
  async list(params: ListParams): Promise<UserListResponse> {
    const { data } = await api.get('/users', { params });
    return data;
  },

  async getDetails(id: string): Promise<UserDetails> {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  async create(userData: CreateUserDTO): Promise<UserDetails> {
    const { data } = await api.post('/users', userData);
    return data;
  },

  async update(id: string, userData: UpdateUserDTO): Promise<UserDetails> {
    const { data } = await api.put(`/users/${id}`, userData);
    return data;
  }
};