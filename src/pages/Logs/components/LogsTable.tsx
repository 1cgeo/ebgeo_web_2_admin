
import React from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  IconButton,
  Box,
  LinearProgress
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
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
  return new Date(dateString).toLocaleString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

interface LogsTableProps {
  logs: LogEntry[];
  loading?: boolean;
  onViewDetails: (log: LogEntry) => void;
}

export const LogsTable: React.FC<LogsTableProps> = ({
  logs,
  loading = false,
  onViewDetails
}) => {
  if (logs.length === 0 && !loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        Nenhum log encontrado com os filtros atuais.
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ position: 'relative' }}>
      {loading && (
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1
          }}
        />
      )}
      
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Timestamp</TableCell>
            <TableCell>Nível</TableCell>
            <TableCell>Categoria</TableCell>
            <TableCell>Mensagem</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow
              key={log.timestamp + log.message}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                {formatDate(log.timestamp)}
              </TableCell>
              <TableCell>
                <Chip
                  label={log.level}
                  color={getLevelColor(log.level)}
                  size="small"
                />
              </TableCell>
              <TableCell>{log.category}</TableCell>
              <TableCell sx={{ maxWidth: 400 }}>
                <Box sx={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {log.message}
                </Box>
              </TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={() => onViewDetails(log)}
                  title="Ver detalhes"
                >
                  <Visibility fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};