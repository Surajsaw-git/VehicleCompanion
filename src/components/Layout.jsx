import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import EmergencyModal from './EmergencyModal';
import { useAuth } from '../context/AuthContext';
import { vehicleService } from '../services/vehicleService';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const { profile, role } = useAuth();

  useEffect(() => {
    if (role === 'owner' && profile) {
      vehicleService.getVehicles(profile.id).then(setVehicles);
    }
  }, [role, profile]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenEmergency={() => setEmergencyOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <EmergencyModal
        isOpen={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
        vehicles={vehicles}
        ownerId={profile?.id}
        onSuccess={() => console.log('Emergency requested')}
      />
    </div>
  );
}
