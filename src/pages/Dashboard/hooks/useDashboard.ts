import { useState, useEffect } from 'react';
import { dashboardService } from '@/services/dashboard';
import type { SystemHealth, SystemMetrics } from '@/types/admin';

export const useDashboard = () => {
  const [healthData, setHealthData] = useState<SystemHealth | null>(null);
  const [metricsData, setMetricsData] = useState<SystemMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [health, metrics] = await Promise.all([
          dashboardService.getHealth(),
          dashboardService.getMetrics()
        ]);
        setHealthData(health);
        setMetricsData(metrics);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const healthInterval = setInterval(() => {
      dashboardService.getHealth().then(setHealthData);
    }, 30000);
    
    const metricsInterval = setInterval(() => {
      dashboardService.getMetrics().then(setMetricsData);
    }, 60000);

    return () => {
      clearInterval(healthInterval);
      clearInterval(metricsInterval);
    };
  }, []);

  return { healthData, metricsData, isLoading, error };
};