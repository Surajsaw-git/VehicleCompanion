import React, { useState, useEffect } from 'react';
import { Wrench, CheckCircle2, Clock, Plus, Loader2, X } from 'lucide-react';
import ServiceCard from '../../components/ServiceCard';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import { serviceRecordService } from '../../services/serviceRecordService';
import { vehicleService } from '../../services/vehicleService';
import { validateServiceForm } from '../../utils/validation';

export default function Requests() {
  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [vehicleId, setVehicleId] = useState('');
  const [serviceType, setServiceType] = useState('General Service');
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [cost, setCost] = useState(3500);
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [sData, vData] = await Promise.all([
        serviceRecordService.getServiceRecords(),
        vehicleService.getVehicles(),
      ]);
      setServices(sData);
      setVehicles(vData);
      if (vData.length > 0 && !vehicleId) setVehicleId(vData[0].id);
    } catch (err) {
      setError(err.message || 'Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await serviceRecordService.updateServiceStatus(id, status);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const validation = validateServiceForm({
      vehicle_id: vehicleId,
      service_type: serviceType,
      service_date: serviceDate,
      cost: Number(cost),
    });

    if (!validation.isValid) {
      setFormError(Object.values(validation.errors)[0]);
      return;
    }

    setSubmitting(true);
    try {
      await serviceRecordService.addServiceRecord({
        vehicle_id: vehicleId,
        service_type: serviceType,
        service_date: serviceDate,
        cost: Number(cost),
        description,
        status: 'Completed',
      });
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.message || 'Failed to create service log.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Service Requests</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update work status for incoming customer vehicle repairs
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition transform active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Service Record</span>
        </button>
      </div>

      {loading ? (
        <Loading message="Loading service requests..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : services.length === 0 ? (
        <EmptyState icon={Wrench} title="No service requests" description="No service records currently logged." />
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Add Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Create Service Record</h3>
            <p className="text-xs text-slate-500 mb-6">Log completed repair or routine maintenance</p>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select Customer Vehicle
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Service Type
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                  >
                    <option value="General Service">General Service</option>
                    <option value="Oil Change">Oil Change</option>
                    <option value="Brake Service">Brake Service</option>
                    <option value="Tyre Rotation">Tyre Rotation</option>
                    <option value="Engine Diagnosis">Engine Diagnosis</option>
                    <option value="Battery Replacement">Battery Replacement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Completion Date
                  </label>
                  <input
                    type="date"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Service Charge (INR ₹)
                </label>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Technician Notes
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Inspected engine oil level, replaced oil filter..."
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
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Service Record</span>
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
