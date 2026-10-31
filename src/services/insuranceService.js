import { supabase, isConfigured } from './supabase';
import { DEMO_INSURANCE } from '../utils/seedData';
import { getInsuranceStatus } from '../utils/dateUtils';

const LOCAL_KEY = 'vehicle_companion_insurance';

function getLocalInsurance() {
  const saved = localStorage.getItem(LOCAL_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch (e) { /* ignore */ }
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(DEMO_INSURANCE));
  return DEMO_INSURANCE;
}

function setLocalInsurance(records) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(records));
}

export const insuranceService = {
  async getInsurancePolicies(vehicleId = null) {
    if (isConfigured && supabase) {
      try {
        let query = supabase.from('insurance').select('*');
        if (vehicleId) query = query.eq('vehicle_id', vehicleId);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(i => ({
            ...i,
            status: getInsuranceStatus(i.expiry_date).status
          }));
        }
      } catch (err) {
        console.warn('Supabase getInsurancePolicies warning:', err);
      }
    }
    const all = getLocalInsurance();
    const result = vehicleId ? all.filter(i => i.vehicle_id === vehicleId) : all;
    return result.map(i => ({
      ...i,
      status: getInsuranceStatus(i.expiry_date).status
    }));
  },

  async addInsurancePolicy(policy) {
    const computedStatus = getInsuranceStatus(policy.expiry_date).status;
    const payload = { ...policy, status: computedStatus };

    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('insurance')
          .insert([payload])
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase addInsurancePolicy fallback:', err);
      }
    }
    const all = getLocalInsurance();
    const newPolicy = {
      id: `ins-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...payload
    };
    const updated = [newPolicy, ...all];
    setLocalInsurance(updated);
    return newPolicy;
  },

  async updatePolicy(id, updates) {
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('insurance')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase updatePolicy fallback:', err);
      }
    }
    const all = getLocalInsurance();
    const updated = all.map(p => p.id === id ? { ...p, ...updates } : p);
    setLocalInsurance(updated);
    return updated.find(p => p.id === id);
  }
};
