import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Wrench, 
  Fuel, 
  ShieldCheck, 
  AlertTriangle, 
  CalendarClock, 
  Plus, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import ReminderCard from '../../components/ReminderCard';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { vehicleService } from '../../services/vehicleService';
import { serviceRecordService } from '../../services/serviceRecordService';
import { fuelService } from '../../services/fuelService';
import { insuranceService } from '../../services/insuranceService';
import { maintenanceService } from '../../services/maintenanceService';
import { emergencyService } from '../../services/emergencyService';
import { formatCurrency } from '../../utils/calculations';
import { formatDate } from '../../utils/dateUtils';

export default function Dashboard() {
  const { profile } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [fuelRecords, setFuelRecords] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [vData, sData, fData, pData, mData, eData] = await Promise.all([
          vehicleService.getVehicles(profile?.id),
          serviceRecordService.getServiceRecords(),
          fuelService.getFuelExpenses(),
          insuranceService.getInsurancePolicies(),
          maintenanceService.getMaintenanceRecords(),
          emergencyService.getEmergencyRequests(profile?.id),
        ]);
        setVehicles(vData);
        setServices(sData);
        setFuelRecords(fData);
        setPolicies(pData);
        setMaintenance(mData);
        setEmergencies(eData);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [profile]);

  if (loading) return <Loading message="Loading your vehicle dashboard..." />;

  // Aggregation Calculations
  const totalFuelCost = fuelRecords.reduce((acc, curr) => acc + (parseFloat(curr.total_cost) || 0), 0);
  const activeInsuranceCount = policies.filter(p => p.status === 'Active').length;
  const dueSoonMaintenance = maintenance.filter(m => m.current_status === 'Due Soon' || m.current_status === 'Overdue');
  const activeEmergency = emergencies.find(e => e.status !== 'Resolved' && e.status !== 'Cancelled');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            Owner Workspace
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Welcome back, {profile?.name || 'Vehicle Owner'}! 👋
          </h1>
          <p className="text-brand-100 text-xs sm:text-sm font-medium">
            Here is a complete summary of your vehicles, expenses, maintenance alerts, and active services.
          </p>
        </div>
        <Car className="w-64 h-64 absolute -right-10 -bottom-16 text-white/10 pointer-events-none" />
      </div>

      {/* Active Emergency Alert if present */}
      {activeEmergency && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-600 text-white rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-900">Active Emergency Assistance Request</h3>
              <p className="text-xs text-red-700">
                Issue: <span className="font-bold">{activeEmergency.issue}</span> • Status: <span className="underline font-bold">{activeEmergency.status}</span>
              </p>
            </div>
          </div>
          <Link
            to="/owner/emergency"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
          >
            Track Status
          </Link>
        </div>
      )}

      {/* Quick Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Vehicles"
          value={vehicles.length}
          subtitle="Registered in Companion"
          icon={Car}
          color="blue"
        />
        <StatCard
          title="Fuel Expenses"
          value={formatCurrency(totalFuelCost)}
          subtitle="Total recorded fill-ups"
          icon={Fuel}
          color="emerald"
        />
        <StatCard
          title="Active Insurance"
          value={`${activeInsuranceCount} / ${vehicles.length || 1}`}
          subtitle="Policies currently valid"
          icon={ShieldCheck}
          color="amber"
        />
        <StatCard
          title="Service History"
          value={services.length}
          subtitle="Records logged"
          icon={Wrench}
          color="purple"
        />
      </div>

      {/* Main Grid: Reminders & Vehicles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Maintenance & Insurance Reminders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CalendarClock className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-bold text-slate-900">Maintenance & Expiry Reminders</h3>
              </div>
              <Link to="/owner/maintenance" className="text-xs font-semibold text-brand-600 hover:underline flex items-center">
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {dueSoonMaintenance.length === 0 ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100 text-xs font-medium">
                ✅ No immediate maintenance due! All registered vehicles are in good condition.
              </div>
            ) : (
              <div className="space-y-3">
                {dueSoonMaintenance.map((m) => (
                  <ReminderCard
                    key={m.id}
                    title={m.maintenance_type}
                    date={m.due_date}
                    status={m.current_status}
                    description={m.description}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Vehicles Overview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Car className="w-5 h-5 text-brand-600" />
                <h3 className="text-lg font-bold text-slate-900">Your Vehicles</h3>
              </div>
              <Link
                to="/owner/vehicles"
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-brand-50 text-brand-700 text-xs font-bold rounded-xl hover:bg-brand-100 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Manage Vehicles</span>
              </Link>
            </div>

            {vehicles.length === 0 ? (
              <EmptyState
                icon={Car}
                title="No vehicles added yet"
                description="Start tracking your vehicle service, fuel, and insurance."
                actionLabel="Add Your First Vehicle"
                onAction={() => window.location.href = '/owner/vehicles'}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicles.slice(0, 2).map((v) => (
                  <div key={v.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md">
                        {v.registration_number}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-2">{v.brand} {v.model}</h4>
                      <p className="text-xs text-slate-500">{v.year} • {v.fuel_type} • {v.mileage?.toLocaleString()} km</p>
                    </div>
                    <Link
                      to={`/owner/vehicles/${v.id}`}
                      className="mt-4 text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center justify-end"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Activity & Quick Links */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Service Records</h3>
            {services.length === 0 ? (
              <p className="text-xs text-slate-500">No recent service records logged.</p>
            ) : (
              <div className="space-y-3">
                {services.slice(0, 3).map((s) => (
                  <div key={s.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{s.service_type}</p>
                      <p className="text-[11px] text-slate-500">{formatDate(s.service_date)}</p>
                    </div>
                    <span className="font-extrabold text-slate-900">{formatCurrency(s.cost)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md">
            <h3 className="text-base font-bold mb-3">Quick Navigation</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/owner/fuel" className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold transition text-slate-200">
                ⛽ Log Fuel
              </Link>
              <Link to="/owner/services" className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold transition text-slate-200">
                🔧 Add Service
              </Link>
              <Link to="/owner/garages" className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold transition text-slate-200">
                🗺️ Find Garages
              </Link>
              <Link to="/owner/insurance" className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold transition text-slate-200">
                🛡️ Insurance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
