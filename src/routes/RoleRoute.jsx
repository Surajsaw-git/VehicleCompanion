import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

export default function RoleRoute({ allowedRoles = [] }) {
  const { role, loading } = useAuth();

  if (loading) return <Loading message="Checking role permissions..." />;
  
  // Super Admin has master access to ALL role-protected routes
  if (role === 'admin' || allowedRoles.includes(role)) {
    return <Outlet />;
  }

  return <Navigate to={`/${role}/dashboard`} replace />;
}
