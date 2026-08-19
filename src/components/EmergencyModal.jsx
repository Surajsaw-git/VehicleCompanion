import React, { useState } from 'react';
import { AlertTriangle, MapPin, Loader2, CheckCircle, X } from 'lucide-react';
import { emergencyService } from '../services/emergencyService';
import { validateEmergencyForm } from '../utils/validation';

export default function EmergencyModal({ isOpen, onClose, vehicles = [], ownerId, onSuccess }) {
  const [issue, setIssue] = useState('Vehicle Breakdown');
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id || '');
  const [description, setDescription] = useState('');
  const [coords, setCoords] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleGetLocation = () => {
    setGettingLocation(true);
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setGettingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setGettingLocation(false);
      },
      (err) => {
        console.warn('Location access error:', err);
        setLocationError('Could not retrieve location. Please check browser permissions.');
        setGettingLocation(false);
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validation = validateEmergencyForm({ issue, description });
    if (!validation.isValid) {
      setError(Object.values(validation.errors)[0]);
      return;
    }

    setSubmitting(true);
    try {
      await emergencyService.createEmergencyRequest({
        owner_id: ownerId,
        vehicle_id: vehicleId || (vehicles[0]?.id || null),
        issue,
        description,
        latitude: coords?.latitude || 28.4595,
        longitude: coords?.longitude || 77.0266,
      });

      setSubmitted(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to send emergency request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-red-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Emergency Dispatch Initiated!</h3>
            <p className="text-sm text-slate-600">
              Your request status is now <span className="font-bold text-amber-600">Pending</span>. Assistance has been notified.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">🚨 Roadside Emergency</h3>
                <p className="text-xs text-slate-500">Request urgent breakdown or towing assistance</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Issue Type
                </label>
                <select
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                >
                  <option value="Vehicle Breakdown">Vehicle Breakdown / Engine Stall</option>
                  <option value="Flat Tyre">Flat Tyre Replacement</option>
                  <option value="Battery Problem">Battery Dead / Jumpstart</option>
                  <option value="Fuel Empty">Out of Fuel</option>
                  <option value="Accident">Accident Assistance</option>
                  <option value="Other">Other Emergency</option>
                </select>
              </div>

              {vehicles.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Vehicle
                  </label>
                  <select
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.brand} {v.model} ({v.registration_number})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Emergency Location
                </label>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={gettingLocation}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition"
                >
                  {gettingLocation ? (
                    <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                  ) : (
                    <MapPin className="w-4 h-4 text-red-600" />
                  )}
                  <span>
                    {coords ? `Captured: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` : 'Capture Current GPS Location'}
                  </span>
                </button>
                {locationError && <p className="text-[11px] text-red-600 mt-1">{locationError}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Describe Problem / Landmarks
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Engine smoke on NH44 highway near toll gate..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:bg-white transition resize-none"
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition active:scale-95 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    <span>Send Emergency Alert</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
