import { api } from './api';
import type { GroupList, GroupDetails, CreateGroupDTO, UpdateGroupDTO, GroupListParams } from '@/types/groups';

export const groupsService = {
  async list(params: GroupListParams): Promise<GroupList> {
    const { data } = await api.get('/api/groups', { params });
    return data;
  },

  async getDetails(id: string): Promise<GroupDetails> {
    const { data } = await api.get(`/api/groups/${id}`);
    return data;
  },

  async create(groupData: CreateGroupDTO): Promise<GroupDetails> {
    const { data } = await api.post('/api/groups', groupData);
    return data;
  },

  async update(id: string, groupData: UpdateGroupDTO): Promise<GroupDetails> {
    const { data } = await api.put(`/api/groups/${id}`, groupData);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/api/groups/${id}`);
  }
};