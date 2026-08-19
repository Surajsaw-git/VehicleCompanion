import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

export default function RoleRoute({ allowedRoles = [] }) {
  const { role, loading } = useAuth();

  if (loading) return <Loading message="Checking role permissions..." />;
  if (!allowedRoles.includes(role)) {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return <Outlet />;
}
