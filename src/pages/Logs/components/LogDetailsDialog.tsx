// Path: pages\Logs\components\LogDetailsDialog.tsx
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Typography,
} from '@mui/material';

import React from 'react';

import type { LogEntry } from '@/types/logs';

import { formatDate, getLevelColor, getLevelLabel } from './logUtils';

const formatDetails = (
  details: Record<string, unknown> | undefined,
): string => {
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
  onClose,
}) => {
  if (!log) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6">Detalhes do Log</Typography>
          <Chip
            label={getLevelLabel(log.level)}
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
              {formatDate(log.time || log.timestamp)}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Categoria
            </Typography>
            <Typography variant="body1">{log.category}</Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Mensagem
            </Typography>
            <Typography variant="body1">
              {log.msg || log.message || 'Sem mensagem'}
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
                backgroundColor: theme =>
                  theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
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
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};
