import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  ShieldCheck, 
  Wrench, 
  Fuel, 
  CalendarClock, 
  AlertTriangle, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  Users
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      {/* Top Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-md">
              <Car className="w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              Vehicle<span className="text-brand-600">Companion</span>
            </span>
          </Link>

          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-brand-600 transition"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2.5 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md hover:shadow-lg transition transform active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-brand-100 text-brand-800 border border-brand-200 mb-6 shadow-xs">
          <Car className="w-4 h-4 text-brand-600" />
          <span>Complete Vehicle Lifecycle Management</span>
        </span>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight mb-6">
          Your Vehicle. Your Records.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
            One Companion.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8 font-medium">
          Manage vehicle service history, fuel expenses, insurance policies, maintenance schedules, roadside emergency assistance, and nearby garages from one unified platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/signup"
            className="inline-flex items-center space-x-2 px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-2xl shadow-xl hover:shadow-2xl transition transform active:scale-95 w-full sm:w-auto justify-center"
          >
            <span>Register Your Vehicle</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 px-7 py-3.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-sm font-bold rounded-2xl shadow-xs transition w-full sm:w-auto justify-center"
          >
            <span>Demo Portal Access</span>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Vehicle Management</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Track specs, mileage, year, fuel types, and registration details for all your personal or fleet vehicles in one place.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
              <Fuel className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Fuel Analytics & Costs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Log fill-ups with automatic cost calculations (quantity × price) and visual monthly expense charts using Recharts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
              <CalendarClock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Maintenance & Insurance Alerts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automatic status calculation for oil changes, brake checks, and policy expiration dates (Active, Expiring Soon, Overdue).
            </p>
          </div>
        </div>
      </section>

      {/* Role Workflows */}
      <section className="bg-white py-16 border-y border-slate-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              Designed for Everyone in the Vehicle Ecosystem
            </h2>
            <p className="text-sm text-slate-600">
              Role-based portals with customized permissions and intuitive dashboards.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-brand-100 text-brand-600 rounded-xl">
                  <Car className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Vehicle Owners</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>Full vehicle lifecycle tracking</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>Instant SOS emergency assistance</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>Leaflet map garage finder</span></li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Mechanics & Garages</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>Incoming service request pipeline</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>Create & update service logs</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>Authorized vehicle specs access</span></li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Insurance Companies</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>Active policy dashboard</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>Expiry tracking & renewals</span></li>
                <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>Authorized policy updates</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <Car className="w-5 h-5 text-brand-500" />
            <span className="font-bold text-white">Vehicle Companion</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex space-x-6">
            <Link to="/login" className="hover:text-white transition">Login</Link>
            <Link to="/signup" className="hover:text-white transition">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
