import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Paper,
  Divider
} from '@mui/material';
import type { LogEntry, LogLevel } from '@/types/logs';

const getLevelColor = (level: LogLevel): "error" | "warning" | "info" | "default" => {
  switch (level) {
    case 'ERROR':
      return 'error';
    case 'WARN':
      return 'warning';
    case 'INFO':
      return 'info';
    default:
      return 'default';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const formatted = date.toLocaleString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  // Adiciona milissegundos manualmente
  const ms = date.getMilliseconds().toString().padStart(3, '0');
  return `${formatted}.${ms}`;
};

const formatDetails = (details: Record<string, unknown> | undefined): string => {
  if (!details) return 'Nenhum detalhe disponível';
  try {
    return JSON.stringify(details, null, 2);
  } catch {
    return 'Erro ao formatar detalhes';
  }
};

interface LogDetailsDialogProps {
  open: boolean;
  log: LogEntry | null;
  onClose: () => void;
}

export const LogDetailsDialog: React.FC<LogDetailsDialogProps> = ({
  open,
  log,
  onClose
}) => {
  if (!log) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" component="span">
            Detalhes do Log
          </Typography>
          <Chip
            label={log.level}
            color={getLevelColor(log.level)}
            size="small"
          />
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Informações Básicas */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Timestamp
            </Typography>
            <Typography variant="body1">
              {formatDate(log.timestamp)}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Categoria
            </Typography>
            <Typography variant="body1">
              {log.category}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Mensagem
            </Typography>
            <Typography variant="body1">
              {log.message}
            </Typography>
          </Box>

          <Divider />

          {/* Detalhes em JSON */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Detalhes
            </Typography>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2,
                backgroundColor: theme => theme.palette.mode === 'dark' 
                  ? 'grey.900' 
                  : 'grey.50'
              }}
            >
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {formatDetails(log.details)}
              </pre>
            </Paper>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};