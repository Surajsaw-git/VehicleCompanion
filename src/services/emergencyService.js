import { supabase, isConfigured } from './supabase';
import { DEMO_EMERGENCY } from '../utils/seedData';

const LOCAL_KEY = 'vehicle_companion_emergency';

function getLocalEmergency() {
  const saved = localStorage.getItem(LOCAL_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch (e) { /* ignore */ }
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(DEMO_EMERGENCY));
  return DEMO_EMERGENCY;
}

function setLocalEmergency(items) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

export const emergencyService = {
  async getEmergencyRequests(ownerId = null) {
    if (isConfigured && supabase) {
      try {
        let query = supabase.from('emergency_requests').select('*').order('created_at', { ascending: false });
        if (ownerId) query = query.eq('owner_id', ownerId);
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase getEmergencyRequests warning:', err);
      }
    }
    const all = getLocalEmergency();
    if (ownerId) return all.filter(e => e.owner_id === ownerId || true);
    return all;
  },

  async createEmergencyRequest(requestData) {
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('emergency_requests')
          .insert([{ ...requestData, status: 'Pending' }])
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase createEmergencyRequest fallback:', err);
      }
    }
    const all = getLocalEmergency();
    const newReq = {
      id: `emg-${Date.now()}`,
      status: 'Pending',
      created_at: new Date().toISOString(),
      ...requestData
    };
    const updated = [newReq, ...all];
    setLocalEmergency(updated);
    return newReq;
  },

  async updateEmergencyStatus(id, newStatus) {
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('emergency_requests')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase updateEmergencyStatus fallback:', err);
      }
    }
    const all = getLocalEmergency();
    const updated = all.map(e => e.id === id ? { ...e, status: newStatus, updated_at: new Date().toISOString() } : e);
    setLocalEmergency(updated);
    return updated.find(e => e.id === id);
  }
};
