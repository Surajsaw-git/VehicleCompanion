import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Car, 
  Wrench, 
  Fuel, 
  ShieldCheck, 
  CalendarClock, 
  ArrowLeft, 
  Gauge, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import Loading from '../../components/Loading';
import ErrorState from '../../components/ErrorState';
import ServiceCard from '../../components/ServiceCard';
import ReminderCard from '../../components/ReminderCard';
import EmptyState from '../../components/EmptyState';
import { vehicleService } from '../../services/vehicleService';
import { serviceRecordService } from '../../services/serviceRecordService';
import { fuelService } from '../../services/fuelService';
import { insuranceService } from '../../services/insuranceService';
import { maintenanceService } from '../../services/maintenanceService';
import { formatCurrency, formatMileage } from '../../utils/calculations';
import { formatDate } from '../../utils/dateUtils';

export default function VehicleDetails() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [services, setServices] = useState([]);
  const [fuelEntries, setFuelEntries] = useState([]);
  const [insurance, setInsurance] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('services');

  useEffect(() => {
    async function loadVehicleData() {
      setLoading(true);
      setError('');
      try {
        const v = await vehicleService.getVehicleById(id);
        if (!v) {
          setError('Vehicle not found.');
          return;
        }
        setVehicle(v);

        const [sData, fData, iData, mData] = await Promise.all([
          serviceRecordService.getServiceRecords(id),
          fuelService.getFuelExpenses(id),
          insuranceService.getInsurancePolicies(id),
          maintenanceService.getMaintenanceRecords(id),
        ]);

        setServices(sData);
        setFuelEntries(fData);
        setInsurance(iData);
        setMaintenance(mData);
      } catch (err) {
        setError(err.message || 'Failed to load vehicle details.');
      } finally {
        setLoading(false);
      }
    }

    loadVehicleData();
  }, [id]);

  if (loading) return <Loading message="Loading vehicle details..." />;
  if (error) return <ErrorState message={error} />;

  const activePolicy = insurance[0] || null;

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <Link
        to="/owner/vehicles"
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Vehicles</span>
      </Link>

      {/* Hero Specs Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="p-4 bg-brand-50 text-brand-600 rounded-2xl border border-brand-100/60">
            <Car className="w-10 h-10" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-mono font-bold rounded-md uppercase tracking-wider">
              {vehicle.registration_number}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Registered in Companion • {vehicle.year} Model
            </p>
          </div>
        </div>

        {/* Specs Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Fuel Type</span>
            <span className="text-sm font-extrabold text-slate-800">{vehicle.fuel_type}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Odometer</span>
            <span className="text-sm font-extrabold text-slate-800">{formatMileage(vehicle.mileage)}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Insurance Status</span>
            <span className="text-sm font-extrabold text-emerald-600">{activePolicy?.status || 'Active'}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation Header */}
      <div className="border-b border-slate-200 flex space-x-4 overflow-x-auto">
        {[
          { id: 'services', label: 'Service History', icon: Wrench, count: services.length },
          { id: 'fuel', label: 'Fuel Expenses', icon: Fuel, count: fuelEntries.length },
          { id: 'maintenance', label: 'Maintenance', icon: CalendarClock, count: maintenance.length },
          { id: 'insurance', label: 'Insurance', icon: ShieldCheck, count: insurance.length },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-3 px-2 border-b-2 text-xs font-bold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 font-extrabold">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          {services.length === 0 ? (
            <EmptyState icon={Wrench} title="No service records" description="No service records logged for this vehicle." />
          ) : (
            services.map((s) => <ServiceCard key={s.id} service={s} />)
          )}
        </div>
      )}

      {activeTab === 'fuel' && (
        <div className="space-y-4">
          {fuelEntries.length === 0 ? (
            <EmptyState icon={Fuel} title="No fuel entries" description="No fuel expense entries recorded yet." />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Quantity</th>
                    <th className="p-3.5">Price / Litre</th>
                    <th className="p-3.5">Total Cost</th>
                    <th className="p-3.5">Odometer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fuelEntries.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-semibold text-slate-800">{formatDate(f.date)}</td>
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
      )}

      {activeTab === 'maintenance' && (
        <div className="space-y-4">
          {maintenance.length === 0 ? (
            <EmptyState icon={CalendarClock} title="No maintenance items" description="No scheduled maintenance records." />
          ) : (
            maintenance.map((m) => (
              <ReminderCard
                key={m.id}
                title={m.maintenance_type}
                date={m.due_date}
                status={m.current_status}
                description={m.description}
              />
            ))
          )}
        </div>
      )}

      {activeTab === 'insurance' && (
        <div className="space-y-4">
          {insurance.length === 0 ? (
            <EmptyState icon={ShieldCheck} title="No insurance policy" description="No policy attached to this vehicle." />
          ) : (
            insurance.map((pol) => (
              <div key={pol.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">{pol.company_name}</h3>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                    {pol.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Policy Number</span>
                    <span className="font-mono font-bold text-slate-800">{pol.policy_number}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Start Date</span>
                    <span className="font-semibold text-slate-700">{formatDate(pol.start_date)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Expiry Date</span>
                    <span className="font-semibold text-slate-700">{formatDate(pol.expiry_date)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Annual Premium</span>
                    <span className="font-extrabold text-slate-900">{formatCurrency(pol.premium)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
