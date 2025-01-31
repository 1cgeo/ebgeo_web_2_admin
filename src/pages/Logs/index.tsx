import React, { useState } from 'react';
import { Box } from '@mui/material';
import { PageContainer } from '@/components/Layout/PageContainer';
import { PageHeader } from '@/components/Layout/PageHeader';
import { LogsTable } from './components/LogsTable';
import { LogsFilterBar } from './components/LogsFilterBar';
import { LogDetailsDialog } from './components/LogDetailsDialog';
import { useLogs } from './hooks/useLogs';
import type { LogEntry } from '@/types/logs';

const LogsPage: React.FC = () => {
  const {
    logs,
    total,
    loading,
    filters,
    handleFilterChange
  } = useLogs();

  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const handleViewDetails = (log: LogEntry) => {
    setSelectedLog(log);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Logs do Sistema"
        subtitle={`Total de ${total} registros encontrados`}
      />

      <LogsFilterBar
        level={filters.level}
        category={filters.category}
        limit={filters.limit || 100}
        onLevelChange={(level) => handleFilterChange({ level })}
        onCategoryChange={(category) => handleFilterChange({ category })}
        onLimitChange={(limit) => handleFilterChange({ limit })}
      />

      <Box sx={{ mt: 3 }}>
        <LogsTable
          logs={logs}
          loading={loading}
          onViewDetails={handleViewDetails}
        />
      </Box>

      <LogDetailsDialog
        open={selectedLog !== null}
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </PageContainer>
  );
};

export default LogsPage;