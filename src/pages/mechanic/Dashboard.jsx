import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Car, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import StatCard from '../../components/StatCard';
import ServiceCard from '../../components/ServiceCard';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { serviceRecordService } from '../../services/serviceRecordService';
import { vehicleService } from '../../services/vehicleService';
import { emergencyService } from '../../services/emergencyService';

export default function MechanicDashboard() {
  const { profile } = useAuth();
  const [services, setServices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sData, vData, eData] = await Promise.all([
          serviceRecordService.getServiceRecords(),
          vehicleService.getVehicles(),
          emergencyService.getEmergencyRequests(),
        ]);
        setServices(sData);
        setVehicles(vData);
        setEmergencies(eData);
      } catch (err) {
        console.error('Error loading mechanic dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <Loading message="Loading mechanic dashboard..." />;

  const pendingServices = services.filter(s => s.status === 'Requested' || s.status === 'In Progress');
  const completedCount = services.filter(s => s.status === 'Completed').length;
  const activeEmergencies = emergencies.filter(e => e.status !== 'Resolved' && e.status !== 'Cancelled');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            Mechanic & Garage Portal
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Welcome, {profile?.name || 'Master Mechanic'}! 🔧
          </h1>
          <p className="text-amber-100 text-xs sm:text-sm font-medium">
            Manage incoming repair requests, update service statuses, and view assigned customer vehicles.
          </p>
        </div>
        <Wrench className="w-64 h-64 absolute -right-10 -bottom-16 text-white/10 pointer-events-none" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Pending Requests"
          value={pendingServices.length}
          subtitle="In-progress or requested"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Completed Services"
          value={completedCount}
          subtitle="Finished jobs"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Emergency Alerts"
          value={activeEmergencies.length}
          subtitle="Active breakdown requests"
          icon={AlertTriangle}
          color="rose"
        />
      </div>

      {/* Active Service Pipeline */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Active Service Pipeline</h3>
          <Link to="/mechanic/requests" className="text-xs font-semibold text-brand-600 hover:underline flex items-center">
            <span>Manage All Requests</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {pendingServices.length === 0 ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100 text-xs font-medium">
            👍 No pending service requests at the moment!
          </div>
        ) : (
          <div className="space-y-4">
            {pendingServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onStatusChange={async (id, st) => {
                  await serviceRecordService.updateServiceStatus(id, st);
                  window.location.reload();
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
