import React from 'react';
import { Wrench, Calendar, DollarSign, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import { formatCurrency } from '../utils/calculations';

export default function ServiceCard({ service, onStatusChange }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return { style: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 };
      case 'In Progress':
        return { style: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock };
      case 'Requested':
        return { style: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertCircle };
      default:
        return { style: 'bg-slate-50 text-slate-700 border-slate-200', icon: Clock };
    }
  };

  const badge = getStatusBadge(service.status);
  const StatusIcon = badge.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow transition">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-100 text-slate-700 rounded-xl">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">{service.service_type}</h4>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDate(service.service_date)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.style}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{service.status}</span>
          </span>
          <span className="text-base font-extrabold text-slate-900">
            {formatCurrency(service.cost)}
          </span>
        </div>
      </div>

      {service.description && (
        <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
          {service.description}
        </p>
      )}

      {onStatusChange && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
          <span className="text-xs font-medium text-slate-500">Update Status:</span>
          {['In Progress', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => onStatusChange(service.id, st)}
              disabled={service.status === st}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                service.status === st
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-brand-50 text-brand-700 hover:bg-brand-600 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
