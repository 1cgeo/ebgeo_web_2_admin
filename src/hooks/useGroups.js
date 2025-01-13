import useSWR from 'swr';
import { useCallback } from 'react';
import api from '../services/api';

const useGroups = (params = {}) => {
  const {
    data,
    error,
    mutate
  } = useSWR(
    ['/auth/groups', params],
    async ([url, params]) => {
      const response = await api.get(url, { params });
      return response.data;
    }
  );

  const createGroup = useCallback(async (groupData) => {
    try {
      const response = await api.post('/auth/groups', groupData);
      mutate();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar grupo');
    }
  }, [mutate]);

  const updateGroup = useCallback(async (groupId, groupData) => {
    try {
      const response = await api.put(`/auth/groups/${groupId}`, groupData);
      mutate();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar grupo');
    }
  }, [mutate]);

  const deleteGroup = useCallback(async (groupId) => {
    try {
      await api.delete(`/auth/groups/${groupId}`);
      mutate();
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao excluir grupo');
    }
  }, [mutate]);

  return {
    groups: data?.groups || [],
    totalGroups: data?.total || 0,
    loading: !error && !data,
    error,
    createGroup,
    updateGroup,
    deleteGroup,
    refresh: mutate
  };
};

export default useGroups;