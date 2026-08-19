import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Gauge, Fuel, Calendar, ShieldCheck, ArrowRight, Edit, Trash2 } from 'lucide-react';
import { formatMileage } from '../utils/calculations';

export default function VehicleCard({ vehicle, insuranceStatus = 'Active', onEdit, onDelete }) {
  const getFuelBadge = (fuel) => {
    switch (fuel) {
      case 'Electric': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Diesel': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CNG': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  const getInsuranceBadge = (status) => {
    if (status === 'Expired') return 'bg-red-100 text-red-700 border-red-200';
    if (status === 'Expiring Soon') return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col justify-between">
      {/* Header Banner */}
      <div className="p-5 pb-4 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 mb-1">
              {vehicle.registration_number}
            </span>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {vehicle.brand} {vehicle.model}
            </h3>
          </div>
          <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl">
            <Car className="w-6 h-6" />
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium border ${getFuelBadge(vehicle.fuel_type)}`}>
            <Fuel className="w-3.5 h-3.5" />
            <span>{vehicle.fuel_type}</span>
          </span>

          <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium border ${getInsuranceBadge(insuranceStatus)}`}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Insurance: {insuranceStatus}</span>
          </span>
        </div>
      </div>

      {/* Info Specs */}
      <div className="p-5 grid grid-cols-2 gap-3 bg-slate-50/50 text-xs text-slate-600">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400">Year</p>
            <p className="font-semibold text-slate-800">{vehicle.year}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Gauge className="w-4 h-4 text-slate-400" />
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400">Mileage</p>
            <p className="font-semibold text-slate-800">{formatMileage(vehicle.mileage)}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-1">
          {onEdit && (
            <button
              onClick={() => onEdit(vehicle)}
              className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition"
              title="Edit Vehicle"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(vehicle.id)}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Delete Vehicle"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <Link
          to={`/owner/vehicles/${vehicle.id}`}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-brand-50 text-brand-700 hover:bg-brand-600 hover:text-white rounded-xl text-xs font-semibold transition"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
