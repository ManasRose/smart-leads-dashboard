import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { LeadFilters, LeadSource, LeadStatus, SortOrder } from '../../types';

interface LeadFiltersProps {
  filters: LeadFilters;
  onFilterChange: (key: keyof LeadFilters, value: string | number) => void;
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  ...Object.values(LeadStatus).map((s) => ({ value: s, label: s })),
];

const sourceOptions = [
  { value: '', label: 'All Sources' },
  ...Object.values(LeadSource).map((s) => ({ value: s, label: s })),
];

const sortOptions = [
  { value: SortOrder.LATEST, label: 'Latest First' },
  { value: SortOrder.OLDEST, label: 'Oldest First' },
];

const LeadFiltersBar: React.FC<LeadFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <SlidersHorizontal size={16} className="text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Input
          placeholder="Search name or email…"
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          icon={<Search size={16} />}
        />
        <Select
          options={statusOptions}
          value={filters.status || ''}
          onChange={(e) => onFilterChange('status', e.target.value)}
        />
        <Select
          options={sourceOptions}
          value={filters.source || ''}
          onChange={(e) => onFilterChange('source', e.target.value)}
        />
        <Select
          options={sortOptions}
          value={filters.sort}
          onChange={(e) => onFilterChange('sort', e.target.value)}
        />
      </div>
    </div>
  );
};

export default LeadFiltersBar;
