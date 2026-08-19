import { supabase, isConfigured } from './supabase';
import { DEMO_MAINTENANCE } from '../utils/seedData';
import { getMaintenanceStatus } from '../utils/dateUtils';

const LOCAL_KEY = 'vehicle_companion_maintenance';

function getLocalMaintenance() {
  const saved = localStorage.getItem(LOCAL_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch (e) { /* ignore */ }
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(DEMO_MAINTENANCE));
  return DEMO_MAINTENANCE;
}

function setLocalMaintenance(items) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

export const maintenanceService = {
  async getMaintenanceRecords(vehicleId = null) {
    if (isConfigured && supabase) {
      let query = supabase.from('maintenance').select('*').order('due_date', { ascending: true });
      if (vehicleId) query = query.eq('vehicle_id', vehicleId);
      const { data, error } = await query;
      if (!error && data) {
        return data.map(m => ({
          ...m,
          current_status: getMaintenanceStatus(m.due_date, m.current_status === 'Completed').status
        }));
      }
    }
    const all = getLocalMaintenance();
    const result = vehicleId ? all.filter(m => m.vehicle_id === vehicleId) : all;
    return result.map(m => ({
      ...m,
      current_status: getMaintenanceStatus(m.due_date, m.current_status === 'Completed').status
    }));
  },

  async addMaintenanceRecord(record) {
    const computedStatus = getMaintenanceStatus(record.due_date).status;
    const payload = { ...record, current_status: computedStatus };

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('maintenance')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const all = getLocalMaintenance();
    const newRecord = {
      id: `maint-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...payload
    };
    const updated = [newRecord, ...all];
    setLocalMaintenance(updated);
    return newRecord;
  },

  async updateMaintenanceStatus(id, newStatus) {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('maintenance')
        .update({ current_status: newStatus })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const all = getLocalMaintenance();
    const updated = all.map(m => m.id === id ? { ...m, current_status: newStatus } : m);
    setLocalMaintenance(updated);
    return updated.find(m => m.id === id);
  }
};
