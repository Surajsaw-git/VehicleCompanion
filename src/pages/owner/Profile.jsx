import React from 'react';
import { User, Mail, Phone, Shield, Car, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { profile } = useAuth();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Account Profile</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage user account details and credentials</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center font-extrabold text-2xl">
            {profile?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{profile?.name}</h2>
            <span className="inline-block px-2.5 py-0.5 mt-1 bg-brand-50 text-brand-700 font-extrabold text-xs rounded font-mono uppercase">
              {profile?.role} Role
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
            </span>
            <p className="text-sm font-semibold text-slate-800">{profile?.email}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number
            </span>
            <p className="text-sm font-semibold text-slate-800">{profile?.phone || 'Not specified'}</p>
          </div>
        </div>

        <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-100 flex items-center space-x-3 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Account active and authenticated with Supabase Row Level Security.</span>
        </div>
      </div>
    </div>
  );
}
