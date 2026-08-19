import React from 'react';
import { UserCheck, ShieldCheck } from 'lucide-react';
import EmptyState from '../../components/EmptyState';

export default function InsuranceRequests() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Verification Requests</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Policy updates and vehicle ownership verification requests
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <EmptyState
          icon={UserCheck}
          title="No pending verification requests"
          description="All policy endorsements and vehicle verifications are up to date."
        />
      </div>
    </div>
  );
}
