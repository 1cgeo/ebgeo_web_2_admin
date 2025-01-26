import { Box, Alert, Paper, styled, Theme, Typography, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { PageHeader } from '@/components/Layout/PageHeader';
import { MetricCard } from '@/components/DataDisplay/MetricCard';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { 
  Storage as StorageIcon,
  Group as GroupIcon,
  CloudQueue as CloudIcon,
  Security as SecurityIcon,
  Api as ApiIcon,
  Timer as TimerIcon,
  Code as CodeIcon,
  Dns as DnsIcon,
  HourglassTop as HourglassIcon,
} from '@mui/icons-material';
import { useDashboard } from './hooks/useDashboard';
import {ServiceHealthCardProps, DatabaseConnectionsProps, ModelsDistributionProps, SystemResourcesProps } from '@/types/admin'

const Item = styled(Paper)(({ theme }: { theme: Theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  height: '100%'
}));

const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  return `${days}d ${hours}h ${minutes}m`;
};

const formatBytes = (bytes: number): string => {
  const gb = bytes / (1024 * 1024 * 1024);
  return `${gb.toFixed(1)} GB`;
};

const DatabaseConnectionsChart: React.FC<DatabaseConnectionsProps> = ({ data }) => {
  const chartData = [
    { name: 'Ativas', value: data.active, color: '#4caf50' },
    { name: 'Ociosas', value: data.idle, color: '#ff9800' }
  ];

  return (
    <Box height={200}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <Box textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Total de Conexões: {data.total}
        </Typography>
      </Box>
    </Box>
  );
};

const ModelsDistributionChart: React.FC<ModelsDistributionProps> = ({ data }) => {
  const chartData = [
    { name: 'Públicos', value: data.public, color: '#2196f3' },
    { name: 'Privados', value: data.private, color: '#f44336' }
  ];

  return (
    <Box height={200}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <Box textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Total de Modelos: {data.total}
        </Typography>
      </Box>
    </Box>
  );
};

const SystemResourcesChart: React.FC<SystemResourcesProps> = ({ data }) => {
  const memoryUsagePercent = (data.memory.used / data.memory.total) * 100;
  
  return (
    <Box>
      <Grid container spacing={3} alignItems="center">
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box textAlign="center">
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              CPU
            </Typography>
            <CircularProgress
              variant="determinate"
              value={data.cpu.usage}
              size={100}
              thickness={6}
              sx={{ mb: 1 }}
            />
            <Typography variant="h6">
              {Math.round(data.cpu.usage)}%
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box textAlign="center">
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Memória
            </Typography>
            <CircularProgress
              variant="determinate"
              value={memoryUsagePercent}
              size={100}
              thickness={6}
              sx={{ mb: 1 }}
            />
            <Typography variant="h6">
              {formatBytes(data.memory.used)} / {formatBytes(data.memory.total)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const ServiceHealthCard = ({ status, name, icon, lastCheck }: ServiceHealthCardProps) => (
  <MetricCard
    title={name}
    value={status}
    icon={icon}
    subtitle={lastCheck?.toLocaleString()}
    severity={status === 'healthy' ? 'success' : status === 'degraded' ? 'warning' : 'error'}
  />
);

const DashboardContent = () => {
  const { healthData, metricsData, isLoading, error } = useDashboard();

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Erro ao carregar dados do dashboard: {error.message}
      </Alert>
    );
  }

  if (!healthData || !metricsData || isLoading) {
    return null;
  }

  return (
    <Box>
      <PageHeader 
        title="Dashboard"
        subtitle="Visão geral do sistema"
      />

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {/* Status Geral */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Item>
              <MetricCard
                title="Status do Sistema"
                value={healthData.status}
                icon={<DnsIcon />}
                severity={healthData.status === 'healthy' ? 'success' : healthData.status === 'degraded' ? 'warning' : 'error'}
              />
            </Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Item>
              <MetricCard
                title="Ambiente"
                value={healthData.environment}
                icon={<CodeIcon />}
              />
            </Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Item>
              <MetricCard
                title="Tempo Online"
                value={formatUptime(healthData.uptime)}
                icon={<TimerIcon />}
              />
            </Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Item>
              <MetricCard
                title="Node.js"
                value={metricsData.system.nodeVersion}
                icon={<CodeIcon />}
              />
            </Item>
          </Grid>

          {/* Serviços */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Item>
              <ServiceHealthCard
                status={healthData.services.database.status}
                name="Database"
                icon={<StorageIcon />}
                lastCheck={new Date(healthData.services.database.lastCheck)}
              />
            </Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Item>
              <ServiceHealthCard
                status={healthData.services.fileSystem.status}
                name="File System"
                icon={<CloudIcon />}
                lastCheck={new Date(healthData.services.fileSystem.lastCheck)}
              />
            </Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Item>
              <ServiceHealthCard
                status={healthData.services.auth.status}
                name="Auth"
                icon={<SecurityIcon />}
                lastCheck={new Date(healthData.services.auth.lastCheck)}
              />
            </Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Item>
              <ServiceHealthCard
                status={healthData.services.api.status}
                name="API"
                icon={<ApiIcon />}
                lastCheck={new Date(healthData.services.api.lastCheck)}
              />
            </Item>
          </Grid>

          {/* Recursos do Sistema */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Item>
              <Typography variant="h6" gutterBottom>Recursos do Sistema</Typography>
              <SystemResourcesChart data={metricsData.system} />
            </Item>
          </Grid>

          {/* Conexões de Banco */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Item>
              <Typography variant="h6" gutterBottom>Conexões de Banco</Typography>
              <DatabaseConnectionsChart data={metricsData.database.connectionPool} />
            </Item>
          </Grid>

          {/* Métricas de Uso */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Item>
              <MetricCard
                title="Usuários Ativos"
                value={metricsData.usage.activeUsers}
                subtitle={`Total: ${metricsData.usage.totalUsers}`}
                icon={<GroupIcon />}
              />
            </Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Item>
              <MetricCard
                title="Total de Grupos"
                value={metricsData.usage.totalGroups}
                icon={<GroupIcon />}
              />
            </Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Item>
              <MetricCard
                title="Requisições 24h"
                value={metricsData.logs.totalRequests24h.toLocaleString()}
                icon={<HourglassIcon />}
              />
            </Item>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Item>
              <Typography variant="h6" gutterBottom>Distribuição de Modelos</Typography>
              <ModelsDistributionChart data={metricsData.usage.totalModels} />
            </Item>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardContent;