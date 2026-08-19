import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail, CheckCircle2 } from 'lucide-react';
import { supabase, isConfigured } from '../services/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isConfigured && supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
      }
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset link.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl max-w-md w-full p-8 text-center">
        <Link to="/" className="inline-flex items-center space-x-2 mb-3">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <Car className="w-6 h-6" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            Vehicle<span className="text-brand-600">Companion</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Reset Password</h2>
        <p className="text-xs text-slate-500 mb-6">Enter your registered email to receive a recovery link</p>

        {sent ? (
          <div className="py-6">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Reset Link Sent</h3>
            <p className="text-xs text-slate-600 mb-6">Check your inbox for password reset instructions.</p>
            <Link to="/login" className="text-xs font-bold text-brand-600 hover:underline">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md transition"
            >
              Send Reset Link
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
                Cancel & Return to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
