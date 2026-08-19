import React from 'react';
import { ShieldCheck, Mail, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function InsuranceProfile() {
  const { profile } = useAuth();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Company Profile</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Insurance company officer details</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center font-extrabold text-2xl">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{profile?.name}</h2>
            <span className="inline-block px-2.5 py-0.5 mt-1 bg-purple-50 text-purple-700 font-extrabold text-xs rounded uppercase">
              Authorized Insurance Officer
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Officer Email</span>
            <p className="text-sm font-semibold text-slate-800">{profile?.email}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Phone Line</span>
            <p className="text-sm font-semibold text-slate-800">{profile?.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
