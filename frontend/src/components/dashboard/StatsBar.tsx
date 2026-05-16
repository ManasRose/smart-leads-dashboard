import React from 'react';
import { Lead, LeadStatus } from '../../types';
import { Users, Flame, Star, TrendingDown } from 'lucide-react';

interface StatsBarProps {
  leads: Lead[];
  total: number;
}

const StatsBar: React.FC<StatsBarProps> = ({ leads, total }) => {
  const counts = {
    [LeadStatus.NEW]: leads.filter((l) => l.status === LeadStatus.NEW).length,
    [LeadStatus.CONTACTED]: leads.filter((l) => l.status === LeadStatus.CONTACTED).length,
    [LeadStatus.QUALIFIED]: leads.filter((l) => l.status === LeadStatus.QUALIFIED).length,
    [LeadStatus.LOST]: leads.filter((l) => l.status === LeadStatus.LOST).length,
  };

  const stats = [
    { label: 'Total Leads', value: total, icon: Users, color: 'text-brand-600 bg-brand-50 dark:bg-brand-900/30' },
    { label: 'New', value: counts[LeadStatus.NEW], icon: Flame, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
    { label: 'Qualified', value: counts[LeadStatus.QUALIFIED], icon: Star, color: 'text-green-600 bg-green-50 dark:bg-green-900/30' },
    { label: 'Lost', value: counts[LeadStatus.LOST], icon: TrendingDown, color: 'text-red-600 bg-red-50 dark:bg-red-900/30' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
