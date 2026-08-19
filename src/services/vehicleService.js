import { supabase, isConfigured } from './supabase';
import { DEMO_VEHICLES } from '../utils/seedData';

const LOCAL_KEY = 'vehicle_companion_vehicles';

function getLocalVehicles() {
  const saved = localStorage.getItem(LOCAL_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch (e) { /* ignore */ }
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(DEMO_VEHICLES));
  return DEMO_VEHICLES;
}

function setLocalVehicles(vehicles) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(vehicles));
}

export const vehicleService = {
  async getVehicles(ownerId) {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    const all = getLocalVehicles();
    if (!ownerId) return all;
    return all.filter(v => v.owner_id === ownerId || true); // return user vehicles
  },

  async getVehicleById(id) {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) return data;
    }
    const all = getLocalVehicles();
    return all.find(v => v.id === id) || null;
  },

  async addVehicle(vehicleData) {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([vehicleData])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const all = getLocalVehicles();
    const newVeh = {
      id: `veh-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...vehicleData
    };
    const updated = [newVeh, ...all];
    setLocalVehicles(updated);
    return newVeh;
  },

  async updateVehicle(id, vehicleData) {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('vehicles')
        .update(vehicleData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const all = getLocalVehicles();
    const updated = all.map(v => v.id === id ? { ...v, ...vehicleData, updated_at: new Date().toISOString() } : v);
    setLocalVehicles(updated);
    return updated.find(v => v.id === id);
  },

  async deleteVehicle(id) {
    if (isConfigured && supabase) {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    }
    const all = getLocalVehicles();
    const filtered = all.filter(v => v.id !== id);
    setLocalVehicles(filtered);
    return true;
  }
};
