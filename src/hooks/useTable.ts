import { useState, useCallback } from 'react';

interface UseTableOptions<T> {
  data: T[];
  initialSort?: keyof T | '';
  initialOrder?: 'asc' | 'desc';
  initialPage?: number;
  initialRowsPerPage?: number;
}

export function useTable<T extends { id: string }>({
  data,
  initialSort = '' as keyof T | '',
  initialOrder = 'asc',
  initialPage = 0,
  initialRowsPerPage = 10
}: UseTableOptions<T>) {
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [orderBy, setOrderBy] = useState<keyof T | ''>(initialSort);
  const [order, setOrder] = useState<'asc' | 'desc'>(initialOrder);
  const [selected, setSelected] = useState<string[]>([]);

  const handleRequestSort = useCallback((property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }, [order, orderBy]);

  const handleSelectAll = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map(n => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  }, [data]);

  const handleSelect = useCallback((id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  }, [selected]);

  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const sortedData = [...data].sort((a, b) => {
    if (!orderBy) return 0;
    return (order === 'asc' ? 1 : -1) * 
           (String(a[orderBy]) > String(b[orderBy]) ? 1 : -1);
  });

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return {
    page,
    rowsPerPage,
    orderBy,
    order,
    selected,
    paginatedData,
    handleRequestSort,
    handleSelectAll,
    handleSelect,
    handleChangePage,
    handleChangeRowsPerPage
  };
}
