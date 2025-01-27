import { api } from './api';
import type { 
  UserListResponse, 
  UserDetails, 
  CreateUserDTO, 
  UpdateUserDTO 
} from '@/types/users';

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'admin' | 'user' | 'all';
  status?: 'active' | 'inactive' | 'all';
  sort?: string;
  order?: 'asc' | 'desc';
}

export const usersService = {
  async list(params: ListParams): Promise<UserListResponse> {
    // Converter o status string para boolean para a API
    const apiParams = {
      ...params,
      status: params.status === 'active' ? true : 
              params.status === 'inactive' ? false : 
              undefined
    };
    
    const { data } = await api.get('/api/users', { params: apiParams });
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
  }
};