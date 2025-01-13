import useSWR from 'swr';
import { useCallback } from 'react';
import api from '../services/api';

const useGroupMembers = (groupId) => {
  const {
    data,
    error,
    mutate
  } = useSWR(
    groupId ? `/auth/groups/${groupId}/members` : null,
    async (url) => {
      const response = await api.get(url);
      return response.data;
    }
  );

  const addMember = useCallback(async (userId) => {
    if (!groupId) return;
    
    try {
      await api.post(`/auth/groups/${groupId}/users`, {
        userId
      });
      mutate();
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao adicionar membro');
    }
  }, [groupId, mutate]);

  const removeMember = useCallback(async (userId) => {
    if (!groupId) return;

    try {
      await api.delete(`/auth/groups/${groupId}/users/${userId}`);
      mutate();
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao remover membro');
    }
  }, [groupId, mutate]);

  const updateMembers = useCallback(async (userIds) => {
    if (!groupId) return;

    try {
      await api.put(`/auth/groups/${groupId}/users`, {
        userIds
      });
      mutate();
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar membros');
    }
  }, [groupId, mutate]);

  return {
    members: data?.members || [],
    totalMembers: data?.total || 0,
    loading: !error && !data,
    error,
    addMember,
    removeMember,
    updateMembers,
    refresh: mutate
  };
};

export default useGroupMembers;