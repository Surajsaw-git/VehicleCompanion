import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Menu, LogOut, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onToggleSidebar, onOpenEmergency }) {
  const { profile, role, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = (r) => {
    if (role === 'admin') {
      // Admin keeps master admin privileges and simply navigates to the portal
      navigate(`/${r}/dashboard`);
    } else {
      switchRole(r);
      navigate(`/${r}/dashboard`);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Menu Toggle & Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 bg-brand-600 group-hover:bg-brand-700 rounded-xl flex items-center justify-center text-white shadow-md transition transform group-hover:scale-105">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-extrabold text-slate-900 tracking-tight block leading-tight">
                  Vehicle<span className="text-brand-600">Companion</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block -mt-0.5">
                  Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Right Actions & Profile */}
          <div className="flex items-center space-x-3">
            {/* Quick Portal Switcher */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200/60">
              <span className="px-2 text-[11px] uppercase tracking-wider text-slate-400">
                {role === 'admin' ? 'Portal Control:' : 'Role:'}
              </span>
              {['owner', 'mechanic', 'insurance'].map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleSwitch(r)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition ${
                    window.location.pathname.startsWith(`/${r}`)
                      ? 'bg-white text-brand-700 shadow-xs font-bold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Emergency Button */}
            {(role === 'owner' || role === 'admin') && (
              <button
                onClick={onOpenEmergency}
                className="inline-flex items-center space-x-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition transform active:scale-95 animate-pulse hover:animate-none"
              >
                <AlertTriangle className="w-4 h-4" />
                <span className="hidden sm:inline">Emergency SOS</span>
              </button>
            )}

            {/* Profile Dropdown / User Details */}
            {profile ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{profile.name}</p>
                  <span className={`inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${
                    role === 'admin'
                      ? 'text-amber-800 bg-amber-100 border border-amber-300 font-extrabold'
                      : 'text-brand-700 bg-brand-50'
                  }`}>
                    {role === 'admin' ? '👑 Master Admin' : profile.role}
                  </span>
                </div>

                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 py-1.5 text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 rounded-xl transition shadow-xs"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
