// Path: pages\Audit\index.tsx
import { Box } from '@mui/material';

import React from 'react';

import { PageContainer } from '@/components/Layout/PageContainer';
import { PageHeader } from '@/components/Layout/PageHeader';

import { usePageTitle } from '@/hooks/usePageTitle';

import type { AuditEntry } from '@/types/audit';

import { AuditDetailsDialog } from './components/AuditDetailsDialog';
import { AuditFilterBar } from './components/AuditFilterBar';
import { AuditTable } from './components/AuditTable';
import { useAudit } from './hooks/useAudit';

const AuditPage: React.FC = () => {
  usePageTitle('Trilha de Auditoria');

  const [selectedEntry, setSelectedEntry] = React.useState<AuditEntry | null>(
    null,
  );

  const {
    entries,
    totalCount,
    page,
    rowsPerPage,
    loading,
    search,
    dateRange,
    selectedAction,
    handlePageChange,
    handleRowsPerPageChange,
    handleSearch,
    handleDateRangeChange,
    handleActionChange,
    clearFilters,
  } = useAudit();

  const handleViewDetails = (entry: AuditEntry) => {
    setSelectedEntry(entry);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Trilha de Auditoria"
        subtitle="Histórico de ações realizadas no sistema"
      />

      <AuditFilterBar
        search={search}
        dateRange={dateRange}
        selectedAction={selectedAction}
        onSearch={handleSearch}
        onDateRangeChange={handleDateRangeChange}
        onActionChange={handleActionChange}
        onClearFilters={clearFilters}
        loading={loading}
      />

      <Box sx={{ mt: 3 }}>
        <AuditTable
          entries={entries}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          loading={loading}
          onViewDetails={handleViewDetails}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>

      <AuditDetailsDialog
        open={Boolean(selectedEntry)}
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </PageContainer>
  );
};

export default AuditPage;
