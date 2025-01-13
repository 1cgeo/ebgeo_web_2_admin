import useSWR from 'swr';
import { useState, useCallback } from 'react';
import { format, subHours } from 'date-fns';

const fetcher = async (url) => {
  const response = await fetch(url, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error('Erro ao buscar métricas');
  }
  
  return response.json();
};

export const useMetrics = () => {
  const [timeRange, setTimeRange] = useState('24h');

  // Função para formatar os parâmetros da URL baseado no timeRange
  const getQueryParams = useCallback(() => {
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case '6h':
        startDate = subHours(now, 6);
        break;
      case '12h':
        startDate = subHours(now, 12);
        break;
      case '7d':
        startDate = subHours(now, 168); // 7 * 24
        break;
      case '24h':
      default:
        startDate = subHours(now, 24);
        break;
    }

    return `startDate=${format(startDate, "yyyy-MM-dd'T'HH:mm:ss")}&endDate=${format(now, "yyyy-MM-dd'T'HH:mm:ss")}`;
  }, [timeRange]);

  // Buscar métricas
  const { data: metrics, error, mutate } = useSWR(
    `/api/admin/metrics?${getQueryParams()}`,
    fetcher,
    {
      refreshInterval: 30000, // 30 segundos
      revalidateOnFocus: true,
    }
  );

  // Processar métricas para o formato necessário
  const processedMetrics = metrics ? {
    system: {
      ...metrics.system,
      memory: {
        ...metrics.system?.memory,
        usedPercentage: metrics.system?.memory
          ? ((metrics.system.memory.used / metrics.system.memory.total) * 100).toFixed(1)
          : 0
      }
    },
    usage: {
      ...metrics.usage,
      activeUsersPercentage: metrics.usage
        ? ((metrics.usage.activeUsers / metrics.usage.totalUsers) * 100).toFixed(1)
        : 0
    },
    database: {
      ...metrics.database,
      connectionUsage: metrics.database?.connectionPool
        ? ((metrics.database.connectionPool.active / metrics.database.connectionPool.total) * 100).toFixed(1)
        : 0
    },
    logs: {
      ...metrics.logs,
      errorRate: metrics.logs
        ? ((metrics.logs.errors24h / metrics.logs.totalRequests24h) * 100).toFixed(2)
        : 0
    }
  } : null;

  return {
    metrics: processedMetrics,
    error,
    loading: !error && !metrics,
    timeRange,
    setTimeRange,
    refresh: mutate
  };
};

export default useMetrics;