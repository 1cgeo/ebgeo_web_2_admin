import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Collapse,
  CircularProgress
} from '@mui/material';
import {
  DateTimePicker
} from '@mui/x-date-pickers';
import {
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import useLogs from '../hooks/useLogs';

const LogSeverityIcon = ({ level }) => {
  switch (level.toUpperCase()) {
    case 'ERROR':
      return <ErrorIcon color="error" />;
    case 'WARN':
      return <WarningIcon color="warning" />;
    case 'INFO':
      return <InfoIcon color="info" />;
    case 'DEBUG':
      return <SuccessIcon color="success" />;
    default:
      return null;
  }
};

const LogEntry = ({ log }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card sx={{ mb: 1 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <LogSeverityIcon level={log.level} />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2">
                {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss')}
              </Typography>
              <Chip
                label={log.category}
                size="small"
                color={
                  log.level === 'ERROR' ? 'error' :
                  log.level === 'WARN' ? 'warning' : 'default'
                }
              />
            </Box>
            <Typography>{log.message}</Typography>

            {log.additionalInfo && (
              <>
                <Button
                  size="small"
                  onClick={() => setExpanded(!expanded)}
                  endIcon={
                    <ExpandMoreIcon
                      sx={{
                        transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s'
                      }}
                    />
                  }
                >
                  {expanded ? 'Menos detalhes' : 'Mais detalhes'}
                </Button>
                <Collapse in={expanded}>
                  <Box 
                    component="pre"
                    sx={{ 
                      mt: 1,
                      p: 1,
                      bgcolor: 'background.default',
                      borderRadius: 1,
                      overflow: 'auto'
                    }}
                  >
                    {JSON.stringify(log.additionalInfo, null, 2)}
                  </Box>
                </Collapse>
              </>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const LogsPage = () => {
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    level: '',
    category: '',
    search: ''
  });

  const { enqueueSnackbar } = useSnackbar();
  const { 
    logs,
    totalLogs,
    loading,
    error,
    exportLogs,
    refresh
  } = useLogs(filters);

  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleDateChange = (field) => (value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExport = async () => {
    try {
      const blob = await exportLogs(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logs-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      enqueueSnackbar(
        'Erro ao exportar logs',
        { variant: 'error' }
      );
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Logs do Sistema</Typography>
        <Box>
          <Tooltip title="Atualizar">
            <IconButton onClick={refresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            disabled={loading}
          >
            Exportar
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <DateTimePicker
              label="Data Inicial"
              value={filters.startDate}
              onChange={handleDateChange('startDate')}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DateTimePicker
              label="Data Final"
              value={filters.endDate}
              onChange={handleDateChange('endDate')}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Nível</InputLabel>
              <Select
                value={filters.level}
                onChange={handleFilterChange('level')}
                label="Nível"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="ERROR">Erro</MenuItem>
                <MenuItem value="WARN">Alerta</MenuItem>
                <MenuItem value="INFO">Info</MenuItem>
                <MenuItem value="DEBUG">Debug</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={filters.category}
                onChange={handleFilterChange('category')}
                label="Categoria"
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="AUTH">Autenticação</MenuItem>
                <MenuItem value="API">API</MenuItem>
                <MenuItem value="DB">Banco de Dados</MenuItem>
                <MenuItem value="SECURITY">Segurança</MenuItem>
                <MenuItem value="SYSTEM">Sistema</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Buscar"
              value={filters.search}
              onChange={handleFilterChange('search')}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Lista de Logs */}
      {error ? (
        <Typography color="error">
          Erro ao carregar logs: {error.message}
        </Typography>
      ) : loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {totalLogs} registro{totalLogs === 1 ? '' : 's'}
          </Typography>

          {logs.map((log) => (
            <LogEntry key={log.id} log={log} />
          ))}
        </>
      )}
    </Box>
  );
};

export default LogsPage;