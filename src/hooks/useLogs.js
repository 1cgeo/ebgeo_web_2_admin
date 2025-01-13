import useSWR from 'swr';
import { useCallback } from 'react';
import { format } from 'date-fns';
import api from '../services/api';

const formatDateParam = (date) => {
  if (!date) return undefined;
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
};

const useLogs = (filters = {}) => {
  const {
    startDate,
    endDate,
    level,
    category,
    search
  } = filters;

  const params = {
    startDate: formatDateParam(startDate),
    endDate: formatDateParam(endDate),
    level,
    category,
    search
  };

  const {
    data,
    error,
    mutate
  } = useSWR(
    ['/admin/logs', params],
    async ([url, params]) => {
      const response = await api.get(url, { params });
      return response.data;
    },
    {
      refreshInterval: 30000 // Atualizar a cada 30 segundos
    }
  );

  const exportLogs = useCallback(async (filters) => {
    const params = {
      startDate: formatDateParam(filters.startDate),
      endDate: formatDateParam(filters.endDate),
      level: filters.level,
      category: filters.category,
      search: filters.search
    };

    const response = await api.get('/admin/logs/export', {
      params,
      responseType: 'blob'
    });

    return response.data;
  }, []);

  return {
    logs: data?.logs || [],
    totalLogs: data?.total || 0,
    loading: !error && !data,
    error,
    exportLogs,
    refresh: mutate
  };
};

export default useLogs;