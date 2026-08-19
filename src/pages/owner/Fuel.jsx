import React, { useState, useEffect } from 'react';
import { Plus, Fuel, TrendingUp, DollarSign, Loader2, X } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import StatCard from '../../components/StatCard';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import { useAuth } from '../../context/AuthContext';
import { fuelService } from '../../services/fuelService';
import { vehicleService } from '../../services/vehicleService';
import { formatCurrency, calculateTotalCost } from '../../utils/calculations';
import { formatDate } from '../../utils/dateUtils';
import { validateFuelForm } from '../../utils/validation';

export default function FuelPage() {
  const { profile } = useAuth();
  const [fuelEntries, setFuelEntries] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [vehicleId, setVehicleId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [fuelType, setFuelType] = useState('Petrol');
  const [quantity, setQuantity] = useState(35);
  const [pricePerLitre, setPricePerLitre] = useState(102);
  const [odometer, setOdometer] = useState(18500);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [vData, fData] = await Promise.all([
        vehicleService.getVehicles(profile?.id),
        fuelService.getFuelExpenses(),
      ]);
      setVehicles(vData);
      setFuelEntries(fData);
      if (vData.length > 0 && !vehicleId) setVehicleId(vData[0].id);
    } catch (err) {
      setError(err.message || 'Failed to load fuel records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [profile]);

  const computedTotal = calculateTotalCost(quantity, pricePerLitre);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const validation = validateFuelForm({
      vehicle_id: vehicleId,
      date,
      quantity: Number(quantity),
      price_per_litre: Number(pricePerLitre),
      odometer: Number(odometer),
    });

    if (!validation.isValid) {
      setFormError(Object.values(validation.errors)[0]);
      return;
    }

    setSubmitting(true);
    try {
      await fuelService.addFuelExpense({
        vehicle_id: vehicleId,
        date,
        fuel_type: fuelType,
        quantity: Number(quantity),
        price_per_litre: Number(pricePerLitre),
        odometer: Number(odometer),
      });
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.message || 'Failed to add fuel record.');
    } finally {
      setSubmitting(false);
    }
  };

  // Recharts Monthly Aggregate Data
  const chartData = React.useMemo(() => {
    const months = {};
    fuelEntries.forEach((entry) => {
      if (!entry.date) return;
      const dateObj = new Date(entry.date);
      const monthName = dateObj.toLocaleString('en-IN', { month: 'short' });
      months[monthName] = (months[monthName] || 0) + (parseFloat(entry.total_cost) || 0);
    });

    return Object.keys(months).map((m) => ({
      month: m,
      amount: months[m],
    }));
  }, [fuelEntries]);

  const grandTotal = fuelEntries.reduce((acc, c) => acc + (parseFloat(c.total_cost) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Fuel Expenses</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track fill-up costs, litres purchased, and monthly expenditure charts
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition transform active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Fuel Fill-Up</span>
        </button>
      </div>

      {loading ? (
        <Loading message="Loading fuel data & charts..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchData} />
      ) : (
        <>
          {/* Stats Header */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Total Fuel Cost"
              value={formatCurrency(grandTotal)}
              subtitle="All time logged expenses"
              icon={Fuel}
              color="emerald"
            />
            <StatCard
              title="Total Fill-Ups"
              value={fuelEntries.length}
              subtitle="Log entries"
              icon={TrendingUp}
              color="blue"
            />
            <StatCard
              title="Average Per Fill-Up"
              value={fuelEntries.length ? formatCurrency(grandTotal / fuelEntries.length) : '₹0'}
              subtitle="Cost per refueling"
              icon={DollarSign}
              color="amber"
            />
          </div>

          {/* Recharts Expenditure Chart */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">Monthly Fuel Spend (INR)</h3>
            <p className="text-xs text-slate-500 mb-6">Visual monthly breakdown of total fuel costs</p>

            {chartData.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-xs text-slate-400">
                No monthly data available to display chart.
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip
                      formatter={(val) => [`₹${val}`, 'Spend']}
                      contentStyle={{ borderRadius: '0.75rem', borderColor: '#cbd5e1' }}
                    />
                    <Bar dataKey="amount" fill="#026fc7" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Fuel Log Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Fuel Fill-Up Logs</h3>
            {fuelEntries.length === 0 ? (
              <EmptyState
                icon={Fuel}
                title="No fuel entries recorded"
                description="Start logging your fuel fill-ups to track consumption and costs over time."
                actionLabel="Log Fuel Fill-Up"
                onAction={() => setModalOpen(true)}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Fuel Type</th>
                      <th className="p-3.5">Quantity (L)</th>
                      <th className="p-3.5">Price / Litre</th>
                      <th className="p-3.5">Total Cost</th>
                      <th className="p-3.5">Odometer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fuelEntries.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50 transition">
                        <td className="p-3.5 font-semibold text-slate-800">{formatDate(f.date)}</td>
                        <td className="p-3.5 font-medium text-slate-600">{f.fuel_type}</td>
                        <td className="p-3.5 font-medium">{f.quantity} L</td>
                        <td className="p-3.5 font-medium">₹{f.price_per_litre}</td>
                        <td className="p-3.5 font-extrabold text-slate-900">{formatCurrency(f.total_cost)}</td>
                        <td className="p-3.5 font-medium text-slate-600">{f.odometer?.toLocaleString()} km</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Log Fuel Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">Log Fuel Fill-Up</h3>
            <p className="text-xs text-slate-500 mb-6">Record fill-up quantity and fuel station price</p>

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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Fill-Up Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Fuel Type
                  </label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Quantity (Litres)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Price / Litre (₹)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pricePerLitre}
                    onChange={(e) => setPricePerLitre(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Odometer Reading (KM)
                </label>
                <input
                  type="number"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                  required
                />
              </div>

              {/* Calculated Cost Preview */}
              <div className="p-3 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-between text-xs">
                <span className="font-bold text-brand-900">Calculated Total Cost:</span>
                <span className="text-base font-extrabold text-brand-700">{formatCurrency(computedTotal)}</span>
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
                    <span>Save Fuel Record</span>
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
