import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Wrench, 
  ShieldCheck, 
  Fuel, 
  CalendarClock, 
  AlertTriangle, 
  MapPin, 
  FileText, 
  UserCheck, 
  X,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { role } = useAuth();

  const navLinksByRole = {
    owner: [
      { to: '/owner/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/owner/vehicles', label: 'My Vehicles', icon: Car },
      { to: '/owner/services', label: 'Service History', icon: Wrench },
      { to: '/owner/insurance', label: 'Insurance Policies', icon: ShieldCheck },
      { to: '/owner/fuel', label: 'Fuel Expenses', icon: Fuel },
      { to: '/owner/maintenance', label: 'Maintenance Schedule', icon: CalendarClock },
      { to: '/owner/emergency', label: 'Emergency Requests', icon: AlertTriangle },
      { to: '/owner/garages', label: 'Nearby Garages', icon: MapPin },
      { to: '/owner/profile', label: 'My Profile', icon: User },
    ],
    mechanic: [
      { to: '/mechanic/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/mechanic/requests', label: 'Service Requests', icon: Wrench },
      { to: '/mechanic/vehicles', label: 'Assigned Vehicles', icon: Car },
      { to: '/mechanic/services', label: 'Service Logs', icon: FileText },
      { to: '/mechanic/profile', label: 'Garage Profile', icon: User },
    ],
    insurance: [
      { to: '/insurance/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/insurance/policies', label: 'Policy Directory', icon: ShieldCheck },
      { to: '/insurance/requests', label: 'Verification Requests', icon: UserCheck },
      { to: '/insurance/profile', label: 'Company Profile', icon: User },
    ],
  };

  const links = navLinksByRole[role] || navLinksByRole.owner;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 overflow-y-auto">
          {/* Header Mobile Close */}
          <div className="flex items-center justify-between lg:hidden pb-4 mb-2 border-b border-slate-100">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Navigation</span>
            <button onClick={onClose} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <span className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
              {role.toUpperCase()} PORTAL
            </span>
            <nav className="space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => onClose && onClose()}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-brand-50 text-brand-700 shadow-xs border border-brand-100/60 font-bold'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer info box */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="p-3 bg-brand-50/80 border border-brand-100 rounded-xl">
            <p className="text-[11px] font-bold text-brand-900">Vehicle Companion v1.0</p>
            <p className="text-[10px] text-brand-700 mt-0.5">Live Production Ready MVP</p>
          </div>
        </div>
      </aside>
    </>
  );
}
