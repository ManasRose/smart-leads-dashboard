import React from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { Lead, UserRole } from '../../types';
import Badge from '../ui/Badge';
import { STATUS_COLORS, SOURCE_COLORS, formatDate } from '../../utils';
import { useAuth } from '../../context/AuthContext';

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onView: (lead: Lead) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({ leads, onEdit, onDelete, onView }) => {
  const { user } = useAuth();

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
            {['Name', 'Email', 'Status', 'Source', 'Created At', 'Created By', 'Actions'].map((h) => (
              <th
                key={h}
                className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {leads.map((lead) => {
            const createdByUser = typeof lead.createdBy === 'object' ? lead.createdBy : null;
            const canModify =
              user?.role === UserRole.ADMIN ||
              (createdByUser && createdByUser.id === user?.id);

            return (
              <tr
                key={lead._id}
                className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600 dark:text-brand-400 font-semibold text-xs flex-shrink-0">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {lead.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{lead.email}</td>
                <td className="px-4 py-3">
                  <Badge className={STATUS_COLORS[lead.status]}>{lead.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge className={SOURCE_COLORS[lead.source]}>{lead.source}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {formatDate(lead.createdAt)}
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {createdByUser?.name || '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onView(lead)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                      title="View"
                    >
                      <Eye size={15} />
                    </button>
                    {canModify && (
                      <>
                        <button
                          onClick={() => onEdit(lead)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => onDelete(lead)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
