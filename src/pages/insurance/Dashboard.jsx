import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import StatCard from '../../components/StatCard';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { insuranceService } from '../../services/insuranceService';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/calculations';

export default function InsuranceDashboard() {
  const { profile } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    insuranceService.getInsurancePolicies().then((data) => {
      setPolicies(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading message="Loading insurance portal dashboard..." />;

  const activeCount = policies.filter((p) => p.status === 'Active').length;
  const expiringCount = policies.filter((p) => p.status === 'Expiring Soon').length;
  const expiredCount = policies.filter((p) => p.status === 'Expired').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-brand-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            Insurance Officer Portal
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Welcome, {profile?.name || 'Insurance Officer'}! 🛡️
          </h1>
          <p className="text-purple-100 text-xs sm:text-sm font-medium">
            Monitor active coverage, policy expiration deadlines, and authorized customer updates.
          </p>
        </div>
        <ShieldCheck className="w-64 h-64 absolute -right-10 -bottom-16 text-white/10 pointer-events-none" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Policies"
          value={activeCount}
          subtitle="Valid coverage"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Expiring Soon"
          value={expiringCount}
          subtitle="Within 30 days"
          icon={AlertTriangle}
          color="amber"
        />
        <StatCard
          title="Expired Policies"
          value={expiredCount}
          subtitle="Action required"
          icon={ShieldCheck}
          color="rose"
        />
      </div>

      {/* Policy Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Authorized Policy Directory</h3>
          <Link to="/insurance/policies" className="text-xs font-semibold text-brand-600 hover:underline flex items-center">
            <span>View All Directory</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {policies.length === 0 ? (
          <EmptyState icon={ShieldCheck} title="No policies found" description="No policy records loaded." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3.5">Policy Number</th>
                  <th className="p-3.5">Company</th>
                  <th className="p-3.5">Start Date</th>
                  <th className="p-3.5">Expiry Date</th>
                  <th className="p-3.5">Premium</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {policies.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-mono font-bold text-slate-900">{p.policy_number}</td>
                    <td className="p-3.5 font-semibold text-slate-800">{p.company_name}</td>
                    <td className="p-3.5 font-medium text-slate-600">{formatDate(p.start_date)}</td>
                    <td className="p-3.5 font-medium text-slate-600">{formatDate(p.expiry_date)}</td>
                    <td className="p-3.5 font-extrabold text-slate-900">{formatCurrency(p.premium)}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.status === 'Expired'
                            ? 'bg-red-100 text-red-700'
                            : p.status === 'Expiring Soon'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
