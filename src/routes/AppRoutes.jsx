import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import Layout from '../components/Layout';

// Public Pages
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ForgotPassword from '../pages/ForgotPassword';

// Owner Pages
import OwnerDashboard from '../pages/owner/Dashboard';
import OwnerVehicles from '../pages/owner/Vehicles';
import VehicleDetails from '../pages/owner/VehicleDetails';
import OwnerServices from '../pages/owner/Services';
import OwnerInsurance from '../pages/owner/Insurance';
import OwnerFuel from '../pages/owner/Fuel';
import OwnerMaintenance from '../pages/owner/Maintenance';
import OwnerEmergency from '../pages/owner/Emergency';
import OwnerGarages from '../pages/owner/Garages';
import OwnerProfile from '../pages/owner/Profile';

// Mechanic Pages
import MechanicDashboard from '../pages/mechanic/Dashboard';
import MechanicRequests from '../pages/mechanic/Requests';
import MechanicVehicles from '../pages/mechanic/Vehicles';
import MechanicServices from '../pages/mechanic/Services';
import MechanicProfile from '../pages/mechanic/Profile';

// Insurance Pages
import InsuranceDashboard from '../pages/insurance/Dashboard';
import InsurancePolicies from '../pages/insurance/Policies';
import InsuranceRequests from '../pages/insurance/Requests';
import InsuranceProfile from '../pages/insurance/Profile';

// Guards
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* Owner Portal (Accessible by Owner & Admin) */}
          <Route element={<RoleRoute allowedRoles={['owner', 'admin']} />}>
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/vehicles" element={<OwnerVehicles />} />
            <Route path="/owner/vehicles/:id" element={<VehicleDetails />} />
            <Route path="/owner/services" element={<OwnerServices />} />
            <Route path="/owner/insurance" element={<OwnerInsurance />} />
            <Route path="/owner/fuel" element={<OwnerFuel />} />
            <Route path="/owner/maintenance" element={<OwnerMaintenance />} />
            <Route path="/owner/emergency" element={<OwnerEmergency />} />
            <Route path="/owner/garages" element={<OwnerGarages />} />
            <Route path="/owner/profile" element={<OwnerProfile />} />
          </Route>

          {/* Mechanic Portal (Accessible by Mechanic & Admin) */}
          <Route element={<RoleRoute allowedRoles={['mechanic', 'admin']} />}>
            <Route path="/mechanic/dashboard" element={<MechanicDashboard />} />
            <Route path="/mechanic/requests" element={<MechanicRequests />} />
            <Route path="/mechanic/vehicles" element={<MechanicVehicles />} />
            <Route path="/mechanic/services" element={<MechanicServices />} />
            <Route path="/mechanic/profile" element={<MechanicProfile />} />
          </Route>

          {/* Insurance Portal (Accessible by Insurance & Admin) */}
          <Route element={<RoleRoute allowedRoles={['insurance', 'admin']} />}>
            <Route path="/insurance/dashboard" element={<InsuranceDashboard />} />
            <Route path="/insurance/policies" element={<InsurancePolicies />} />
            <Route path="/insurance/requests" element={<InsuranceRequests />} />
            <Route path="/insurance/profile" element={<InsuranceProfile />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
