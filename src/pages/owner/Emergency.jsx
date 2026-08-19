import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Clock, CheckCircle2, Navigation } from 'lucide-react';
import EmergencyModal from '../../components/EmergencyModal';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import { useAuth } from '../../context/AuthContext';
import { emergencyService } from '../../services/emergencyService';
import { vehicleService } from '../../services/vehicleService';
import { formatDate } from '../../utils/dateUtils';

export default function Emergency() {
  const { profile } = useAuth();
  const [requests, setRequests] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [vData, eData] = await Promise.all([
        vehicleService.getVehicles(profile?.id),
        emergencyService.getEmergencyRequests(profile?.id),
      ]);
      setVehicles(vData);
      setRequests(eData);
    } catch (err) {
      setError(err.message || 'Failed to load emergency requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [profile]);

  const getStatusStepClass = (currentStatus, stepName) => {
    const steps = ['Pending', 'Assigned', 'On the Way', 'Resolved'];
    const currentIdx = steps.indexOf(currentStatus);
    const stepIdx = steps.indexOf(stepName);
    if (stepIdx <= currentIdx) return 'bg-red-600 text-white font-bold';
    return 'bg-slate-100 text-slate-400 font-medium';
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-extrabold uppercase tracking-wider mb-2 inline-block">
            🚨 24/7 Roadside Assistance
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Emergency Assistance</h1>
          <p className="text-red-100 text-xs sm:text-sm mt-1 max-w-xl">
            Stuck with a breakdown, flat tyre, or empty tank? Request immediate towing or roadside support.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-3 bg-white text-red-700 hover:bg-red-50 text-xs font-black rounded-2xl shadow-xl transition transform active:scale-95 shrink-0"
        >
          Request Emergency SOS
        </button>
      </div>

      {loading ? (
        <Loading message="Loading emergency requests..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No active emergency requests"
          description="Your roadside assistance request logs will appear here."
          actionLabel="Request SOS Assistance"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Request History & Live Dispatch Status</h3>
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="px-2.5 py-1 bg-red-100 text-red-700 font-extrabold text-xs rounded-md">
                    {req.issue}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-2">{req.description}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Requested on {formatDate(req.created_at)}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 block uppercase">Current Status</span>
                  <span className="text-base font-black text-red-600">{req.status}</span>
                </div>
              </div>

              {/* Status Flow Bar */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {['Pending', 'Assigned', 'On the Way', 'Resolved'].map((st) => (
                  <div
                    key={st}
                    className={`py-2 px-1 text-center rounded-xl text-[11px] transition ${getStatusStepClass(
                      req.status,
                      st
                    )}`}
                  >
                    {st}
                  </div>
                ))}
              </div>

              {req.latitude && (
                <div className="pt-2 flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span>Location: {req.latitude?.toFixed(4)}, {req.longitude?.toFixed(4)}</span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${req.latitude},${req.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-brand-600 hover:underline flex items-center gap-1"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>View Map</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <EmergencyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        vehicles={vehicles}
        ownerId={profile?.id}
        onSuccess={fetchData}
      />
    </div>
  );
}
