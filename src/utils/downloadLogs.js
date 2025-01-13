import { format } from 'date-fns';

export const downloadLogs = (logs, filters = {}) => {
  // Preparar nome do arquivo
  const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm');
  const filename = `ebgeo-logs-${timestamp}.json`;

  // Adicionar metadados à exportação
  const exportData = {
    metadata: {
      exportedAt: new Date().toISOString(),
      filters: {
        startDate: filters.startDate?.toISOString(),
        endDate: filters.endDate?.toISOString(),
        level: filters.level,
        category: filters.category,
        search: filters.search
      },
      totalLogs: logs.length
    },
    logs: logs
  };

  // Criar blob e iniciar download
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadLogsAsCsv = (logs, filters = {}) => {
  // Preparar nome do arquivo
  const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm');
  const filename = `ebgeo-logs-${timestamp}.csv`;

  // Converter logs para formato CSV
  const headers = ['Timestamp', 'Level', 'Category', 'Message', 'Details'];
  
  const rows = logs.map(log => [
    format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss'),
    log.level,
    log.category,
    log.message,
    JSON.stringify(log.additionalInfo || '')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Criar blob e iniciar download
  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};