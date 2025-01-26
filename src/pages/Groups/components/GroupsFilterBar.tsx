import React, { useCallback } from 'react';
import { FilterBar } from '@/components/Form/FilterBar';
import { MemorizedSearchField } from './MemorizedSearchField';

interface GroupsFilterBarProps {
  search: string;
  loading?: boolean;
  onSearch: (value: string) => void;
}

export const GroupsFilterBar: React.FC<GroupsFilterBarProps> = ({
  search,
  onSearch
}) => {
  const handleClear = useCallback(() => {
    onSearch('');
  }, [onSearch]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  }, [onSearch]);

  return (
    <FilterBar>
      <MemorizedSearchField
        value={search}
        onChange={handleChange}
        onClear={handleClear}
      />
    </FilterBar>
  );
};