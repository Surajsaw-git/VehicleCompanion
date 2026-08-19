import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isConfigured } from '../services/supabase';
import { DEMO_PROFILES } from '../utils/seedData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize demo user default or active session
  useEffect(() => {
    async function initAuth() {
      if (isConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.id);
          } else {
            loadDefaultDemoUser('owner');
          }

          const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
              setUser(session.user);
              await fetchProfile(session.user.id);
            } else {
              setUser(null);
              setProfile(null);
            }
          });

          return () => {
            authListener?.subscription?.unsubscribe();
          };
        } catch (err) {
          console.warn('Supabase Auth init error, using fallback demo auth:', err);
          loadDefaultDemoUser('owner');
        } finally {
          setLoading(false);
        }
      } else {
        // Fallback demo authentication
        const savedProfile = localStorage.getItem('vehicle_companion_active_profile');
        if (savedProfile) {
          try {
            const parsed = JSON.parse(savedProfile);
            setProfile(parsed);
            setUser({ id: parsed.id, email: parsed.email });
          } catch (e) {
            loadDefaultDemoUser('owner');
          }
        } else {
          loadDefaultDemoUser('owner');
        }
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  function loadDefaultDemoUser(role = 'owner') {
    const demo = DEMO_PROFILES.find(p => p.role === role) || DEMO_PROFILES[0];
    setProfile(demo);
    setUser({ id: demo.id, email: demo.email });
    localStorage.setItem('vehicle_companion_active_profile', JSON.stringify(demo));
  }

  async function fetchProfile(userId) {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!error && data) {
        setProfile(data);
        return;
      }
    }
  }

  const login = async (email, password, intendedRole = 'owner') => {
    setLoading(true);
    try {
      if (isConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setUser(data.user);
        await fetchProfile(data.user.id);
        return { success: true };
      } else {
        // Demo login matching email or role
        const match = DEMO_PROFILES.find(p => p.email.toLowerCase() === email.toLowerCase()) || 
                      DEMO_PROFILES.find(p => p.role === intendedRole) || {
          id: `usr-${Date.now()}`,
          name: email.split('@')[0],
          email,
          role: intendedRole,
          phone: '+91 98765 00000'
        };
        setProfile(match);
        setUser({ id: match.id, email: match.email });
        localStorage.setItem('vehicle_companion_active_profile', JSON.stringify(match));
        return { success: true };
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ name, email, password, phone, role }) => {
    setLoading(true);
    try {
      if (isConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, phone, role }
          }
        });
        if (error) throw error;
        
        if (data.user) {
          // Insert into profiles table
          await supabase.from('profiles').insert([{
            id: data.user.id,
            name,
            email,
            phone,
            role
          }]);
        }
        return { success: true };
      } else {
        const newProf = {
          id: `usr-${Date.now()}`,
          name,
          email,
          phone: phone || '+91 98765 11111',
          role: role || 'owner'
        };
        setProfile(newProf);
        setUser({ id: newProf.id, email });
        localStorage.setItem('vehicle_companion_active_profile', JSON.stringify(newProf));
        return { success: true };
      }
    } finally {
      setLoading(false);
    }
  };

  const switchRole = (newRole) => {
    loadDefaultDemoUser(newRole);
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isConfigured && supabase) {
        await supabase.auth.signOut();
      }
      setUser(null);
      setProfile(null);
      localStorage.removeItem('vehicle_companion_active_profile');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    profile,
    role: profile?.role || 'owner',
    loading,
    login,
    signup,
    logout,
    switchRole,
    isAuthenticated: Boolean(user)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
