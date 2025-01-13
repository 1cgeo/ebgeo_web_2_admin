import React from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import useSWR from 'swr';

// Componentes locais das métricas
const MetricCard = ({ title, value, subtitle, loading, error }) => (
  <Card>
    <CardContent>
      <Typography color="textSecondary" gutterBottom>
        {title}
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress size={20} />
        </Box>
      ) : error ? (
        <Typography color="error">Erro ao carregar</Typography>
      ) : (
        <>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {subtitle}
          </Typography>
        </>
      )}
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  // Buscar métricas do sistema
  const { data: metrics, error: metricsError } = useSWR('/api/admin/metrics', {
    refreshInterval: 30000 // Atualizar a cada 30 segundos
  });

  // Processar dados para os gráficos
  const systemMetrics = metrics?.system || {};
  const usageMetrics = metrics?.usage || {};
  const logMetrics = metrics?.logs || {};

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Métricas do Sistema */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="CPU"
            value={`${systemMetrics.cpu?.usage?.toFixed(1)}%`}
            subtitle="Utilização atual"
            loading={!metrics}
            error={metricsError}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Memória"
            value={`${((systemMetrics.memory?.used || 0) / 1024 / 1024 / 1024).toFixed(1)}GB`}
            subtitle={`De ${((systemMetrics.memory?.total || 0) / 1024 / 1024 / 1024).toFixed(1)}GB`}
            loading={!metrics}
            error={metricsError}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Usuários Ativos"
            value={usageMetrics.activeUsers || 0}
            subtitle={`De ${usageMetrics.totalUsers || 0} usuários`}
            loading={!metrics}
            error={metricsError}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Erros (24h)"
            value={logMetrics.errors24h || 0}
            subtitle={`${logMetrics.warnings24h || 0} alertas`}
            loading={!metrics}
            error={metricsError}
          />
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        {/* Gráfico de CPU/Memória */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Utilização de Recursos
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={systemMetrics.history?.slice(-20) || []}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cpu" stroke="#8884d8" name="CPU %" />
                    <Line type="monotone" dataKey="memory" stroke="#82ca9d" name="Memória %" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Requisições */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Requisições por Hora
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={metrics?.requests?.hourly || []}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#2196f3" 
                      fill="#2196f3" 
                      fillOpacity={0.3} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Métricas do Banco de Dados */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Status do Banco de Dados
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <MetricCard
                    title="Conexões Ativas"
                    value={metrics?.database?.connectionPool?.active || 0}
                    subtitle={`De ${metrics?.database?.connectionPool?.total || 0} conexões`}
                    loading={!metrics}
                    error={metricsError}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <MetricCard
                    title="Modelos 3D"
                    value={usageMetrics.totalModels?.total || 0}
                    subtitle={`${usageMetrics.totalModels?.public || 0} públicos`}
                    loading={!metrics}
                    error={metricsError}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <MetricCard
                    title="Grupos"
                    value={usageMetrics.totalGroups || 0}
                    subtitle="Total de grupos"
                    loading={!metrics}
                    error={metricsError}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <MetricCard
                    title="Cache Hit Rate"
                    value={`${metrics?.database?.stats?.cacheHitRate?.toFixed(1)}%`}
                    subtitle="Últimas 24h"
                    loading={!metrics}
                    error={metricsError}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;