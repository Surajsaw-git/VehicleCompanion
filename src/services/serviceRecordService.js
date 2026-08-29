import { supabase, isConfigured } from './supabase';
import { DEMO_SERVICES } from '../utils/seedData';

const LOCAL_KEY = 'vehicle_companion_services';

function getLocalServices() {
  const saved = localStorage.getItem(LOCAL_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch (e) { /* ignore */ }
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(DEMO_SERVICES));
  return DEMO_SERVICES;
}

function setLocalServices(services) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(services));
}

export const serviceRecordService = {
  async getServiceRecords(vehicleId = null) {
    if (isConfigured && supabase) {
      try {
        let query = supabase.from('service_records').select('*').order('service_date', { ascending: false });
        if (vehicleId) query = query.eq('vehicle_id', vehicleId);
        const { data, error } = await query;
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase service_records query warning:', err);
      }
    }
    const all = getLocalServices();
    if (vehicleId) return all.filter(s => s.vehicle_id === vehicleId);
    return all;
  },

  async addServiceRecord(record) {
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('service_records')
          .insert([record])
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase addServiceRecord warning:', err);
      }
    }
    const all = getLocalServices();
    const newRecord = {
      id: `srv-${Date.now()}`,
      status: record.status || 'Completed',
      created_at: new Date().toISOString(),
      ...record
    };
    const updated = [newRecord, ...all];
    setLocalServices(updated);
    return newRecord;
  },

  async updateServiceStatus(id, status) {
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('service_records')
          .update({ status })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase updateServiceStatus warning:', err);
      }
    }
    const all = getLocalServices();
    const updated = all.map(s => s.id === id ? { ...s, status } : s);
    setLocalServices(updated);
    return updated.find(s => s.id === id);
  }
};
