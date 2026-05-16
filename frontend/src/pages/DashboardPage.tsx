import React, { useState, useCallback } from 'react';
import { Plus, LayoutGrid, List, Download } from 'lucide-react';
import Navbar from '../components/dashboard/Navbar';
import StatsBar from '../components/dashboard/StatsBar';
import LeadFiltersBar from '../components/leads/LeadFilters';
import LeadCard from '../components/leads/LeadCard';
import LeadTable from '../components/leads/LeadTable';
import LeadForm from '../components/leads/LeadForm';
import LeadDetailModal from '../components/leads/LeadDetailModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import {
  useLeads,
  useCreateLead,
  useUpdateLead,
  useDeleteLead,
} from '../hooks/useLeads';
import { useDebounce } from '../hooks/useDebounce';
import { Lead, LeadFilters, LeadFormData, SortOrder } from '../types';
import { leadsApi } from '../api/leads.api';
import { downloadCSVBlob } from '../utils';
import toast from 'react-hot-toast';

const DEFAULT_FILTERS: LeadFilters = {
  page: 1,
  limit: 10,
  status: '',
  source: '',
  search: '',
  sort: SortOrder.LATEST,
};

const DashboardPage: React.FC = () => {
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [view, setView] = useState<'grid' | 'table'>('table');

  // Modals state
  const [createOpen, setCreateOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [deleteLead, setDeleteLeadLead] = useState<Lead | null>(null);
  const [exporting, setExporting] = useState(false);

  // Debounce search
  const debouncedSearch = useDebounce(filters.search, 400);
  const activeFilters = { ...filters, search: debouncedSearch };

  const { data, isLoading, isError } = useLeads(activeFilters);
  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();

  const leads = data?.data || [];
  const meta = data?.meta;

  const handleFilterChange = useCallback(
    (key: keyof LeadFilters, value: string | number) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        ...(key !== 'page' ? { page: 1 } : {}),
      }));
    },
    []
  );

  const handleCreate = async (formData: LeadFormData) => {
    await createMutation.mutateAsync(formData);
    setCreateOpen(false);
  };

  const handleUpdate = async (formData: LeadFormData) => {
    if (!editLead) return;
    await updateMutation.mutateAsync({ id: editLead._id, data: formData });
    setEditLead(null);
  };

  const handleDelete = async () => {
    if (!deleteLead) return;
    await deleteMutation.mutateAsync(deleteLead._id);
    setDeleteLeadLead(null);
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const blob = await leadsApi.exportCSV(activeFilters);
      downloadCSVBlob(blob, `leads-${new Date().toISOString().slice(0, 10)}.csv`);
      toast.success('CSV exported!');
    } catch {
      toast.error('Failed to export CSV.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Manage and track your sales leads
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              icon={<Download size={16} />}
              onClick={handleExportCSV}
              loading={exporting}
              size="sm"
            >
              Export CSV
            </Button>
            <Button
              icon={<Plus size={16} />}
              onClick={() => setCreateOpen(true)}
              size="sm"
            >
              Add Lead
            </Button>
          </div>
        </div>

        {/* Stats */}
        <StatsBar leads={leads} total={meta?.total || 0} />

        {/* Filters */}
        <LeadFiltersBar filters={filters} onFilterChange={handleFilterChange} />

        {/* View toggle */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {meta ? `${meta.total} lead${meta.total !== 1 ? 's' : ''} found` : ''}
          </p>
          <div className="flex items-center gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
            <button
              onClick={() => setView('table')}
              className={`p-1.5 rounded transition-colors ${
                view === 'table'
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              title="Table view"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded transition-colors ${
                view === 'grid'
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              title="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size={36} />
          </div>
        ) : isError ? (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-8 text-center">
            <p className="text-red-600 dark:text-red-400 font-medium">Failed to load leads.</p>
            <p className="text-red-500 dark:text-red-500 text-sm mt-1">Please try refreshing the page.</p>
          </div>
        ) : leads.length === 0 ? (
          <EmptyState
            title="No leads found"
            description={
              filters.search || filters.status || filters.source
                ? 'Try adjusting your filters.'
                : 'Get started by adding your first lead.'
            }
            action={
              !filters.search && !filters.status && !filters.source ? (
                <Button icon={<Plus size={16} />} onClick={() => setCreateOpen(true)}>
                  Add First Lead
                </Button>
              ) : undefined
            }
          />
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.map((lead) => (
              <LeadCard
                key={lead._id}
                lead={lead}
                onEdit={setEditLead}
                onDelete={setDeleteLeadLead}
                onView={setViewLead}
              />
            ))}
          </div>
        ) : (
          <LeadTable
            leads={leads}
            onEdit={setEditLead}
            onDelete={setDeleteLeadLead}
            onView={setViewLead}
          />
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <Pagination
            meta={meta}
            onPageChange={(page) => handleFilterChange('page', page)}
          />
        )}
      </main>

      {/* Create Modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Add New Lead" size="md">
        <LeadForm
          onSubmit={handleCreate}
          loading={createMutation.isPending}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead" size="md">
        {editLead && (
          <LeadForm
            onSubmit={handleUpdate}
            loading={updateMutation.isPending}
            initialData={editLead}
            onCancel={() => setEditLead(null)}
          />
        )}
      </Modal>

      {/* View Modal */}
      <LeadDetailModal
        lead={viewLead}
        isOpen={!!viewLead}
        onClose={() => setViewLead(null)}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteLead}
        onClose={() => setDeleteLeadLead(null)}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        title="Delete Lead"
        message={`Are you sure you want to delete "${deleteLead?.name}"? This cannot be undone.`}
      />
    </div>
  );
};

export default DashboardPage;
