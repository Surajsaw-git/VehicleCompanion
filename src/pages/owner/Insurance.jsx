import React, { useState, useEffect } from 'react';
import { Plus, ShieldCheck, AlertTriangle, Calendar, DollarSign, Loader2, X } from 'lucide-react';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import { useAuth } from '../../context/AuthContext';
import { insuranceService } from '../../services/insuranceService';
import { vehicleService } from '../../services/vehicleService';
import { formatDate, getDaysRemaining } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/calculations';
import { validateInsuranceForm } from '../../utils/validation';

export default function Insurance() {
  const { profile } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Form
  const [vehicleId, setVehicleId] = useState('');
  const [companyName, setCompanyName] = useState('HDFC ERGO');
  const [policyNumber, setPolicyNumber] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [premium, setPremium] = useState(15000);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [vData, pData] = await Promise.all([
        vehicleService.getVehicles(profile?.id),
        insuranceService.getInsurancePolicies(),
      ]);
      setVehicles(vData);
      setPolicies(pData);
      if (vData.length > 0 && !vehicleId) setVehicleId(vData[0].id);
    } catch (err) {
      setError(err.message || 'Failed to load insurance policies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const validation = validateInsuranceForm({
      vehicle_id: vehicleId,
      company_name: companyName,
      policy_number: policyNumber,
      start_date: startDate,
      expiry_date: expiryDate,
      premium: Number(premium),
    });

    if (!validation.isValid) {
      setFormError(Object.values(validation.errors)[0]);
      return;
    }

    setSubmitting(true);
    try {
      await insuranceService.addInsurancePolicy({
        vehicle_id: vehicleId,
        company_name: companyName,
        policy_number: policyNumber,
        start_date: startDate,
        expiry_date: expiryDate,
        premium: Number(premium),
      });
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.message || 'Failed to save policy.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Insurance Policies</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track policy coverage, premium costs, and expiry deadlines
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition transform active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Insurance Policy</span>
        </button>
      </div>

      {loading ? (
        <Loading message="Loading insurance policies..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : policies.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No insurance policies"
          description="Keep your vehicles covered by logging active insurance policies."
          actionLabel="Add Insurance Policy"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {policies.map((pol) => {
            const daysLeft = getDaysRemaining(pol.expiry_date);
            const isWarning = daysLeft <= 30 && daysLeft >= 0;
            const isExpired = daysLeft < 0;

            return (
              <div
                key={pol.id}
                className={`bg-white rounded-3xl border p-6 shadow-sm flex flex-col justify-between ${
                  isExpired
                    ? 'border-red-200 bg-red-50/20'
                    : isWarning
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-slate-200/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2.5 bg-brand-50 text-brand-600 rounded-xl">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{pol.company_name}</h3>
                        <p className="text-xs font-mono text-slate-500 font-semibold">{pol.policy_number}</p>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isExpired
                          ? 'bg-red-100 text-red-700'
                          : isWarning
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {pol.status}
                    </span>
                  </div>

                  {/* Warning banner */}
                  {isWarning && (
                    <div className="my-3 p-3 bg-amber-100/70 border border-amber-200 rounded-xl flex items-center space-x-2 text-xs font-semibold text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Policy expires in {daysLeft} days! Renew soon.</span>
                    </div>
                  )}
                  {isExpired && (
                    <div className="my-3 p-3 bg-red-100/70 border border-red-200 rounded-xl flex items-center space-x-2 text-xs font-semibold text-red-900">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Policy expired {Math.abs(daysLeft)} days ago! Urgent renewal required.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-4">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Start Date</span>
                      <span className="font-semibold text-slate-800">{formatDate(pol.start_date)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Expiry Date</span>
                      <span className="font-semibold text-slate-800">{formatDate(pol.expiry_date)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Annual Premium:</span>
                  <span className="text-lg font-extrabold text-slate-900">{formatCurrency(pol.premium)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Policy Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Add Insurance Policy</h3>
            <p className="text-xs text-slate-500 mb-6">Enter policy number and coverage dates</p>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select Vehicle
                </label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                  required
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.brand} {v.model} ({v.registration_number})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Insurance Provider
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. HDFC ERGO, ICICI Lombard..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Policy Number
                </label>
                <input
                  type="text"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  placeholder="POL-12345678"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Annual Premium Cost (INR ₹)
                </label>
                <input
                  type="number"
                  value={premium}
                  onChange={(e) => setPremium(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition font-bold"
                  required
                />
              </div>

              <div className="mt-6 flex items-center justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Policy</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
