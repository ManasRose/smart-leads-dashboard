import React from 'react';
import { Mail, Calendar, Pencil, Trash2, Eye } from 'lucide-react';
import { Lead, UserRole } from '../../types';
import Badge from '../ui/Badge';
import { STATUS_COLORS, SOURCE_COLORS, formatDate } from '../../utils';
import { useAuth } from '../../context/AuthContext';

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onView: (lead: Lead) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onEdit, onDelete, onView }) => {
  const { user } = useAuth();
  const createdByUser = typeof lead.createdBy === 'object' ? lead.createdBy : null;

  const canModify =
    user?.role === UserRole.ADMIN ||
    (createdByUser && createdByUser.id === user?.id);

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600 dark:text-brand-400 font-semibold text-sm flex-shrink-0">
            {lead.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
              {lead.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 text-gray-500 dark:text-gray-400">
              <Mail size={12} />
              <span className="text-xs truncate max-w-[180px]">{lead.email}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onView(lead)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
            title="View details"
          >
            <Eye size={15} />
          </button>
          {canModify && (
            <>
              <button
                onClick={() => onEdit(lead)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                title="Edit lead"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => onDelete(lead)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Delete lead"
              >
                <Trash2 size={15} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge className={STATUS_COLORS[lead.status]}>{lead.status}</Badge>
        <Badge className={SOURCE_COLORS[lead.source]}>{lead.source}</Badge>
      </div>

      {/* Notes */}
      {lead.notes && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
          {lead.notes}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
          <Calendar size={12} />
          <span className="text-xs">{formatDate(lead.createdAt)}</span>
        </div>
        {createdByUser && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            by {createdByUser.name}
          </span>
        )}
      </div>
    </div>
  );
};

export default LeadCard;
