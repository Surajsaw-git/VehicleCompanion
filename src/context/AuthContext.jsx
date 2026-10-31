import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isConfigured } from '../services/supabase';
import { DEMO_PROFILES } from '../utils/seedData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session or restore active profile
  useEffect(() => {
    async function initAuth() {
      if (isConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.id, session.user);
          } else {
            restoreLocalProfileOrDefault('owner');
          }

          const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
              setUser(session.user);
              await fetchProfile(session.user.id, session.user);
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
              setProfile(null);
              localStorage.removeItem('vehicle_companion_active_profile');
            }
          });

          return () => {
            authListener?.subscription?.unsubscribe();
          };
        } catch (err) {
          console.warn('Supabase Auth session init error, using local fallback:', err);
          restoreLocalProfileOrDefault('owner');
        } finally {
          setLoading(false);
        }
      } else {
        restoreLocalProfileOrDefault('owner');
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  function restoreLocalProfileOrDefault(defaultRole = 'owner') {
    const saved = localStorage.getItem('vehicle_companion_active_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.role) {
          setProfile(parsed);
          setUser({ id: parsed.id, email: parsed.email });
          return;
        }
      } catch (e) {
        // Fallback to default
      }
    }
    loadDefaultDemoUser(defaultRole);
  }

  function loadDefaultDemoUser(role = 'owner') {
    const demo = DEMO_PROFILES.find(p => p.role === role) || DEMO_PROFILES[0];
    setProfile(demo);
    setUser({ id: demo.id, email: demo.email });
    localStorage.setItem('vehicle_companion_active_profile', JSON.stringify(demo));
    return demo;
  }

  async function fetchProfile(userId, userObj = null) {
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        if (!error && data) {
          setProfile(data);
          localStorage.setItem('vehicle_companion_active_profile', JSON.stringify(data));
          return data;
        }
      } catch (e) {
        console.warn('Could not query public.profiles:', e);
      }
    }

    // If profile row doesn't exist in Supabase yet, construct from user metadata or demo dataset
    const matchedDemo = DEMO_PROFILES.find(p => 
      p.id === userId || (userObj?.email && p.email.toLowerCase() === userObj.email.toLowerCase())
    );

    const fallbackProfile = matchedDemo || {
      id: userId,
      name: userObj?.user_metadata?.name || userObj?.email?.split('@')[0] || 'User',
      email: userObj?.email || 'user@example.com',
      phone: userObj?.user_metadata?.phone || '+91 98765 00000',
      role: userObj?.user_metadata?.role || (userObj?.email === 'mukeshsahu42781@gmail.com' ? 'admin' : 'owner')
    };

    setProfile(fallbackProfile);
    localStorage.setItem('vehicle_companion_active_profile', JSON.stringify(fallbackProfile));
    return fallbackProfile;
  }

  const login = async (email, password, intendedRole = 'owner') => {
    setLoading(true);
    try {
      const normalizedEmail = (email || '').toLowerCase().trim();

      // Master Admin credential handler
      if (normalizedEmail === 'mukeshsahu42781@gmail.com') {
        if (password && password !== 'muk@123456') {
          throw new Error('Incorrect password for Admin account.');
        }
        const adminProfile = DEMO_PROFILES.find(p => p.role === 'admin') || {
          id: 'admin-1',
          name: 'Mukesh Sahu (Super Admin)',
          email: 'mukeshsahu42781@gmail.com',
          phone: '9876543210',
          role: 'admin'
        };
        setProfile(adminProfile);
        setUser({ id: adminProfile.id, email: adminProfile.email });
        localStorage.setItem('vehicle_companion_active_profile', JSON.stringify(adminProfile));
        return { success: true, profile: adminProfile };
      }

      if (isConfigured && supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (!error && data?.user) {
            setUser(data.user);
            const prof = await fetchProfile(data.user.id, data.user);
            return { success: true, profile: prof };
          }
          if (error) {
            // Check if login credentials match local permanent demo accounts or role selection
            const demoMatch = DEMO_PROFILES.find(p => p.email.toLowerCase() === normalizedEmail) ||
                              DEMO_PROFILES.find(p => p.role === intendedRole);

            if (demoMatch) {
              setProfile(demoMatch);
              setUser({ id: demoMatch.id, email: demoMatch.email });
              localStorage.setItem('vehicle_companion_active_profile', JSON.stringify(demoMatch));
              return { success: true, profile: demoMatch };
            }
            throw error;
          }
        } catch (supabaseErr) {
          const demoMatch = DEMO_PROFILES.find(p => p.email.toLowerCase() === normalizedEmail) ||
                            DEMO_PROFILES.find(p => p.role === intendedRole);

          if (demoMatch) {
            setProfile(demoMatch);
            setUser({ id: demoMatch.id, email: demoMatch.email });
            localStorage.setItem('vehicle_companion_active_profile', JSON.stringify(demoMatch));
            return { success: true, profile: demoMatch };
          }
          throw supabaseErr;
        }
      } else {
        // Fallback demo authentication
        const match = DEMO_PROFILES.find(p => p.email.toLowerCase() === normalizedEmail) || 
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
        return { success: true, profile: match };
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ name, email, password, phone, role }) => {
    setLoading(true);
    try {
      if (isConfigured && supabase) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { name, phone, role }
            }
          });
          if (error) throw error;
          
          if (data.user) {
            try {
              await supabase.from('profiles').insert([{
                id: data.user.id,
                name,
                email,
                phone,
                role
              }]);
            } catch (pErr) {
              console.warn('Profile table insert warning:', pErr);
            }
            const prof = {
              id: data.user.id,
              name,
              email,
              phone: phone || '',
              role: role || 'owner'
            };
            setProfile(prof);
            setUser(data.user);
            localStorage.setItem('vehicle_companion_active_profile', JSON.stringify(prof));
            return { success: true, profile: prof };
          }
        } catch (authErr) {
          // Fallback to local profile creation
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
          return { success: true, profile: newProf };
        }
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
        return { success: true, profile: newProf };
      }
    } finally {
      setLoading(false);
    }
  };

  const switchRole = (newRole) => {
    return loadDefaultDemoUser(newRole);
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isConfigured && supabase) {
        try {
          await supabase.auth.signOut();
        } catch (e) {
          // ignore signout network error
        }
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
