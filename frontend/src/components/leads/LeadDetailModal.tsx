import React from 'react';
import { Mail, Calendar, User, FileText, Tag } from 'lucide-react';
import { Lead } from '../../types';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import { STATUS_COLORS, SOURCE_COLORS, formatDate } from '../../utils';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const DetailRow: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 text-gray-400 flex-shrink-0">{icon}</div>
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</div>
    </div>
  </div>
);

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, isOpen, onClose }) => {
  if (!lead) return null;

  const createdByUser = typeof lead.createdBy === 'object' ? lead.createdBy : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lead Details" size="md">
      <div className="flex flex-col gap-5">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="w-14 h-14 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold text-xl">
            {lead.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{lead.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-2">
          <Badge className={STATUS_COLORS[lead.status]}>{lead.status}</Badge>
          <Badge className={SOURCE_COLORS[lead.source]}>{lead.source}</Badge>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 gap-4">
          <DetailRow icon={<Mail size={16} />} label="Email" value={lead.email} />
          <DetailRow icon={<Tag size={16} />} label="Source" value={lead.source} />
          <DetailRow icon={<Calendar size={16} />} label="Created At" value={formatDate(lead.createdAt)} />
          <DetailRow icon={<Calendar size={16} />} label="Last Updated" value={formatDate(lead.updatedAt)} />
          {createdByUser && (
            <DetailRow
              icon={<User size={16} />}
              label="Created By"
              value={`${createdByUser.name} (${createdByUser.email})`}
            />
          )}
          {lead.notes && (
            <DetailRow
              icon={<FileText size={16} />}
              label="Notes"
              value={<span className="whitespace-pre-wrap">{lead.notes}</span>}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default LeadDetailModal;
