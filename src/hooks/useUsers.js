import useSWR from 'swr';
import { useCallback } from 'react';
import api from '../services/api';

const useUsers = (params = {}) => {
  const {
    data,
    error,
    mutate
  } = useSWR(
    ['/admin/users', params],
    async ([url, params]) => {
      const response = await api.get(url, { params });
      return response.data;
    }
  );

  const createUser = useCallback(async (userData) => {
    try {
      const response = await api.post('/auth/users', userData);
      mutate();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar usuário');
    }
  }, [mutate]);

  const updateUser = useCallback(async (userId, userData) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      mutate();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar usuário');
    }
  }, [mutate]);

  const regenerateApiKey = useCallback(async (userId) => {
    try {
      const response = await api.post(`/auth/api-key/regenerate/${userId}`);
      mutate();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao regenerar API key');
    }
  }, [mutate]);

  return {
    users: data?.users || [],
    totalUsers: data?.total || 0,
    loading: !error && !data,
    error,
    createUser,
    updateUser,
    regenerateApiKey,
    refresh: mutate
  };
};

export default useUsers;