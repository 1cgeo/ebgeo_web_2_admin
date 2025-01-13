import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  IconButton,
  Tooltip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  Chip
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';

const ApiKeyDialog = ({ open, onClose, user, onRegenerate }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [apiKeyHistory, setApiKeyHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // Buscar histórico de API keys quando o diálogo abrir
  React.useEffect(() => {
    const fetchHistory = async () => {
      if (open && user) {
        try {
          const response = await fetch(`/api/auth/api-key/history?userId=${user.id}`, {
            credentials: 'include'
          });
          const data = await response.json();
          setApiKeyHistory(data.history);
        } catch (error) {
          console.error('Error fetching API key history:', error);
          enqueueSnackbar(
            'Erro ao buscar histórico de API keys',
            { variant: 'error' }
          );
        }
      }
    };

    fetchHistory();
  }, [open, user, enqueueSnackbar]);

  const handleCopyApiKey = (apiKey) => {
    navigator.clipboard.writeText(apiKey).then(
      () => enqueueSnackbar('API key copiada!', { variant: 'success' }),
      () => enqueueSnackbar('Erro ao copiar API key', { variant: 'error' })
    );
  };

  const handleRegenerateApiKey = async () => {
    if (!confirm('Tem certeza que deseja gerar uma nova API key? A key atual será revogada.')) {
      return;
    }

    setLoading(true);
    try {
      await onRegenerate(user.id);
      enqueueSnackbar('API key regenerada com sucesso!', { variant: 'success' });

      // Atualizar histórico
      const response = await fetch(`/api/auth/api-key/history?userId=${user.id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setApiKeyHistory(data.history);
    } catch (error) {
      console.error('Error regenerating API key:', error);
      enqueueSnackbar(
        error.message || 'Erro ao regenerar API key',
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Gerenciar API Key - {user?.username}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            API Key Atual
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              fullWidth
              value={user?.apiKey || ''}
              InputProps={{ readOnly: true }}
            />
            <Tooltip title="Copiar">
              <IconButton onClick={() => handleCopyApiKey(user?.apiKey)}>
                <CopyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Regenerar">
              <IconButton 
                onClick={handleRegenerateApiKey}
                disabled={loading}
                color="primary"
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Alert severity="warning" sx={{ mt: 2 }}>
            A API key é secreta. Não compartilhe com ninguém e mantenha em um local seguro.
          </Alert>
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          Histórico de API Keys
        </Typography>

        <List>
          {apiKeyHistory.map((history, index) => (
            <ListItem
              key={history.apiKey}
              divider={index < apiKeyHistory.length - 1}
              secondaryAction={
                <Chip
                  label={history.isActive ? 'Ativa' : 'Revogada'}
                  color={history.isActive ? 'success' : 'default'}
                  size="small"
                />
              }
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ 
                      fontFamily: 'monospace',
                      flex: 1
                    }}>
                      {history.apiKey}
                    </Typography>
                    <Tooltip title="Copiar">
                      <IconButton 
                        size="small"
                        onClick={() => handleCopyApiKey(history.apiKey)}
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
                secondary={
                  <>
                    Criada em: {format(new Date(history.createdAt), 'dd/MM/yyyy HH:mm')}
                    {history.revokedAt && (
                      <> • Revogada em: {format(new Date(history.revokedAt), 'dd/MM/yyyy HH:mm')}</>
                    )}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApiKeyDialog;