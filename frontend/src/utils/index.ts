import { LeadStatus, LeadSource } from '../types';

export const STATUS_COLORS: Record<LeadStatus, string> = {
  [LeadStatus.NEW]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  [LeadStatus.CONTACTED]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  [LeadStatus.QUALIFIED]: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  [LeadStatus.LOST]: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

export const SOURCE_COLORS: Record<LeadSource, string> = {
  [LeadSource.WEBSITE]: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  [LeadSource.INSTAGRAM]: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  [LeadSource.REFERRAL]: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
};

export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const downloadCSVBlob = (blob: Blob, filename = 'leads.csv'): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
