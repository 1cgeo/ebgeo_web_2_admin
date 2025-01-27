import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
  Grid
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  AccountCircle as UserIcon,
  Category as CategoryIcon,
  Info as InfoIcon,
  Computer as ComputerIcon
} from '@mui/icons-material';
import type { AuditEntry } from '@/types/audit';
import { auditActionLabels, targetTypeLabels } from '@/types/audit';

interface AuditDetailsDialogProps {
  open: boolean;
  entry: AuditEntry | null;
  onClose: () => void;
}

export const AuditDetailsDialog: React.FC<AuditDetailsDialogProps> = ({
  open,
  entry,
  onClose
}) => {
  if (!entry) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  // Função para renderizar o objeto de detalhes de forma recursiva
  const renderDetails = (details: Record<string, unknown>, indent = 0): React.ReactNode => {
    return (
      <Box sx={{ pl: indent }}>
        {Object.entries(details).map(([key, value]) => (
          <Box key={key} sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary" component="span">
              {key}:{' '}
            </Typography>
            {typeof value === 'object' && value !== null ? (
              renderDetails(value as Record<string, unknown>, indent + 2)
            ) : (
              <Typography variant="body2" component="span">
                {String(value)}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoIcon color="primary" />
          <Typography variant="h6">
            Detalhes do Registro de Auditoria
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Informações Básicas */}
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TimeIcon color="action" />
                <Typography variant="body2" color="text.secondary">
                  Registrado em {formatDate(entry.timestamp)}
                </Typography>
              </Box>

              <Chip
                label={auditActionLabels[entry.action]}
                color={entry.action.includes('DELETE') ? 'error' : 
                       entry.action.includes('CREATE') ? 'success' : 'warning'}
                sx={{ mb: 2 }}
              />
            </Box>
          </Grid>

          {/* Usuário */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" gutterBottom>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <UserIcon fontSize="small" />
                Usuário
              </Box>
            </Typography>
            <Typography variant="body2">
              {entry.actor.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {entry.actor.id}
            </Typography>
          </Grid>

          {/* Alvo */}
          {entry.target && (
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CategoryIcon fontSize="small" />
                  Alvo
                </Box>
              </Typography>
              <Typography variant="body2">
                {targetTypeLabels[entry.target.type]}: {entry.target.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID: {entry.target.id}
              </Typography>
            </Grid>
          )}

          {/* Detalhes Técnicos */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ComputerIcon fontSize="small" />
                Informações Técnicas
              </Box>
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  IP: {entry.ip}
                </Typography>
              </Grid>
              {entry.userAgent && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    User Agent: {entry.userAgent}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>

          {/* Detalhes da Ação */}
          {Object.keys(entry.details).length > 0 && (
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Detalhes da Ação
              </Typography>
              {renderDetails(entry.details)}
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};