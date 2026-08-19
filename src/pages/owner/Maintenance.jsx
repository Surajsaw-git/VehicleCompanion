import React, { useState, useEffect } from 'react';
import { Plus, CalendarClock, Loader2, X } from 'lucide-react';
import ReminderCard from '../../components/ReminderCard';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import { useAuth } from '../../context/AuthContext';
import { maintenanceService } from '../../services/maintenanceService';
import { vehicleService } from '../../services/vehicleService';

export default function Maintenance() {
  const { profile } = useAuth();
  const [items, setItems] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [vehicleId, setVehicleId] = useState('');
  const [maintenanceType, setMaintenanceType] = useState('Engine Oil Change');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [vData, mData] = await Promise.all([
        vehicleService.getVehicles(profile?.id),
        maintenanceService.getMaintenanceRecords(),
      ]);
      setVehicles(vData);
      setItems(mData);
      if (vData.length > 0 && !vehicleId) setVehicleId(vData[0].id);
    } catch (err) {
      setError(err.message || 'Failed to load maintenance records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [profile]);

  const handleMarkCompleted = async (id) => {
    try {
      await maintenanceService.updateMaintenanceStatus(id, 'Completed');
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!vehicleId) {
      setFormError('Vehicle selection is required.');
      return;
    }
    if (!dueDate) {
      setFormError('Due date is required.');
      return;
    }

    setSubmitting(true);
    try {
      await maintenanceService.addMaintenanceRecord({
        vehicle_id: vehicleId,
        maintenance_type: maintenanceType,
        due_date: dueDate,
        description,
      });
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.message || 'Failed to add maintenance schedule.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Maintenance Schedule</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Automated alerts for oil changes, brake inspections, and routine servicing
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition transform active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Maintenance</span>
        </button>
      </div>

      {loading ? (
        <Loading message="Loading maintenance schedules..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No scheduled maintenance"
          description="Schedule upcoming service tasks to prevent unexpected vehicle breakdowns."
          actionLabel="Schedule Maintenance"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <ReminderCard
              key={m.id}
              title={m.maintenance_type}
              date={m.due_date}
              status={m.current_status}
              description={m.description}
              onAction={m.current_status !== 'Completed' ? () => handleMarkCompleted(m.id) : null}
            />
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Schedule Maintenance</h3>
            <p className="text-xs text-slate-500 mb-6">Set target date for upcoming vehicle service</p>

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
                  Maintenance Type
                </label>
                <select
                  value={maintenanceType}
                  onChange={(e) => setMaintenanceType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                >
                  <option value="Engine Oil Change">Engine Oil Change</option>
                  <option value="Brake Inspection">Brake Inspection</option>
                  <option value="Tyre Rotation & Balancing">Tyre Rotation & Balancing</option>
                  <option value="Battery Check">Battery Check</option>
                  <option value="Air Filter Replacement">Air Filter Replacement</option>
                  <option value="General Inspection">General Inspection</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Scheduled Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Task Notes / Details
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Check front disc pads and top up fluid..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition resize-none"
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
                      <span>Scheduling...</span>
                    </>
                  ) : (
                    <span>Save Schedule</span>
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
