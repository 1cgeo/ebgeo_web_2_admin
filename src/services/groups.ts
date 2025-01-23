import { api } from './api';
import { GroupList, GroupDetails, CreateGroupDTO, UpdateGroupDTO } from '@/types/groups';

interface GroupListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const groupsService = {
  async list(params: GroupListParams): Promise<GroupList> {
    const { data } = await api.get('/groups', { params });
    return data;
  },

  async create(groupData: CreateGroupDTO): Promise<GroupDetails> {
    const { data } = await api.post('/groups', groupData);
    return data;
  },

  async update(id: string, groupData: UpdateGroupDTO): Promise<GroupDetails> {
    const { data } = await api.put(`/groups/${id}`, groupData);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/groups/${id}`);
  }
};