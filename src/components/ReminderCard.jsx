import React from 'react';
import { AlertCircle, Clock, CheckCircle, Shield, Wrench } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

export default function ReminderCard({ title, date, type = 'maintenance', status = 'Upcoming', description, onAction }) {
  const getStyle = (st) => {
    switch (st) {
      case 'Overdue':
      case 'Expired':
        return {
          bg: 'bg-red-50/80 border-red-200',
          badge: 'bg-red-100 text-red-700',
          iconBg: 'bg-red-100 text-red-600',
          icon: AlertCircle
        };
      case 'Due Soon':
      case 'Expiring Soon':
        return {
          bg: 'bg-amber-50/80 border-amber-200',
          badge: 'bg-amber-100 text-amber-700',
          iconBg: 'bg-amber-100 text-amber-600',
          icon: Clock
        };
      default:
        return {
          bg: 'bg-blue-50/50 border-blue-100',
          badge: 'bg-blue-100 text-blue-700',
          iconBg: 'bg-blue-100 text-blue-600',
          icon: type === 'insurance' ? Shield : Wrench
        };
    }
  };

  const currentStyle = getStyle(status);
  const StatusIcon = currentStyle.icon;

  return (
    <div className={`p-4 rounded-2xl border ${currentStyle.bg} flex items-start justify-between gap-3 shadow-sm transition`}>
      <div className="flex items-start space-x-3">
        <div className={`p-2.5 rounded-xl ${currentStyle.iconBg}`}>
          <StatusIcon className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-bold text-slate-900">{title}</h4>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${currentStyle.badge}`}>
              {status}
            </span>
          </div>
          {description && <p className="text-xs text-slate-600 mt-0.5">{description}</p>}
          <p className="text-[11px] font-semibold text-slate-500 mt-1">Due: {formatDate(date)}</p>
        </div>
      </div>

      {onAction && (
        <button
          onClick={onAction}
          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition shadow-xs self-center"
        >
          Mark Done
        </button>
      )}
    </div>
  );
}
