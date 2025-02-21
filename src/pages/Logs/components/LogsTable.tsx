// Path: pages\Logs\components\LogsTable.tsx
import { Visibility } from '@mui/icons-material';
import {
  Box,
  Chip,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import React from 'react';

import type { LogEntry } from '@/types/logs';

import { formatDate, getLevelColor, getLevelLabel } from './logUtils';

interface LogsTableProps {
  logs: LogEntry[];
  loading?: boolean;
  onViewDetails: (log: LogEntry) => void;
}

export const LogsTable: React.FC<LogsTableProps> = ({
  logs,
  loading = false,
  onViewDetails,
}) => {
  if (logs.length === 0 && !loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Nenhum log encontrado com os filtros atuais.
        </Typography>
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
            zIndex: 1,
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
          {logs.map((log, index) => {
            const time = log.time || log.timestamp;

            return (
              <TableRow
                key={`${time}-${index}`}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {formatDate(time)}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getLevelLabel(log.level)}
                    color={getLevelColor(log.level)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{log.category}</TableCell>
                <TableCell sx={{ maxWidth: 400 }}>
                  <Box
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {log.msg || log.message || 'Sem mensagem'}
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
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
