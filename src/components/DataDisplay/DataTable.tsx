import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Checkbox,
  Paper,
  LinearProgress
} from '@mui/material';
import { EmptyState } from '@/components/Feedback/EmptyState';

interface DataItem {
  id: string;
  [key: string]: unknown;
}

interface Column<T extends DataItem> {
  id: keyof T;
  label: string;
  align?: 'left' | 'right' | 'center';
  format?: (value: T[keyof T]) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T extends DataItem> {
  columns: Column<T>[];
  data: T[];
  selected?: string[];
  orderBy?: keyof T;
  order?: 'asc' | 'desc';
  page: number;
  rowsPerPage: number;
  totalCount: number;
  loading?: boolean;
  selectable?: boolean;
  emptyState?: {
    title: string;
    description?: string;
    icon?: React.ReactNode;
  };
  onSort?: (property: keyof T) => void;
  onSelectAll?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect?: (id: string) => void;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DataTable<T extends DataItem>({
  columns,
  data,
  selected = [],
  orderBy,
  order,
  page,
  rowsPerPage,
  totalCount,
  loading = false,
  selectable = false,
  emptyState,
  onSort,
  onSelectAll,
  onSelect,
  onPageChange,
  onRowsPerPageChange
}: DataTableProps<T>) {
  if (data.length === 0 && !loading && emptyState) {
    return (
      <EmptyState
        title={emptyState.title}
        description={emptyState.description}
        icon={emptyState.icon}
      />
    );
  }

  return (
    <Paper sx={{ width: '100%', position: 'relative' }}>
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
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < data.length}
                    checked={data.length > 0 && selected.length === data.length}
                    onChange={onSelectAll}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {column.sortable && onSort ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => onSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                hover
                key={row.id}
                selected={selected.indexOf(row.id) !== -1}
              >
                {selectable && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.indexOf(row.id) !== -1}
                      onChange={() => onSelect?.(row.id)}
                    />
                  </TableCell>
                )}
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={String(column.id)} align={column.align}>
                      {column.format ? column.format(value) : value as React.ReactNode}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
}