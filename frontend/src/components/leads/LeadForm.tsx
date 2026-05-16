import React from 'react';
import { useForm } from 'react-hook-form';
import { Lead, LeadFormData, LeadSource, LeadStatus } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface LeadFormProps {
  onSubmit: (data: LeadFormData) => void;
  loading?: boolean;
  initialData?: Lead;
  onCancel: () => void;
}

const statusOptions = Object.values(LeadStatus).map((s) => ({ value: s, label: s }));
const sourceOptions = Object.values(LeadSource).map((s) => ({ value: s, label: s }));

const LeadForm: React.FC<LeadFormProps> = ({ onSubmit, loading, initialData, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    defaultValues: initialData
      ? {
          name: initialData.name,
          email: initialData.email,
          status: initialData.status,
          source: initialData.source,
          notes: initialData.notes || '',
        }
      : {
          status: LeadStatus.NEW,
          source: LeadSource.WEBSITE,
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Full Name *"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register('name', {
          required: 'Name is required',
          minLength: { value: 2, message: 'Name must be at least 2 characters' },
          maxLength: { value: 100, message: 'Name cannot exceed 100 characters' },
        })}
      />

      <Input
        label="Email Address *"
        type="email"
        placeholder="john@example.com"
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: 'Please enter a valid email',
          },
        })}
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Status *"
          options={statusOptions}
          error={errors.status?.message}
          {...register('status', { required: 'Status is required' })}
        />
        <Select
          label="Source *"
          options={sourceOptions}
          error={errors.source?.message}
          {...register('source', { required: 'Source is required' })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
        <textarea
          placeholder="Optional notes about this lead…"
          rows={3}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors resize-none"
          {...register('notes', {
            maxLength: { value: 500, message: 'Notes cannot exceed 500 characters' },
          })}
        />
        {errors.notes && <p className="text-xs text-red-500">{errors.notes.message}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          {initialData ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};

export default LeadForm;
