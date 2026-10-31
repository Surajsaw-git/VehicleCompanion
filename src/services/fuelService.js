import { supabase, isConfigured } from './supabase';
import { DEMO_FUEL } from '../utils/seedData';
import { calculateTotalCost } from '../utils/calculations';

const LOCAL_KEY = 'vehicle_companion_fuel';

function getLocalFuel() {
  const saved = localStorage.getItem(LOCAL_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch (e) { /* ignore */ }
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(DEMO_FUEL));
  return DEMO_FUEL;
}

function setLocalFuel(fuel) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(fuel));
}

export const fuelService = {
  async getFuelExpenses(vehicleId = null) {
    if (isConfigured && supabase) {
      try {
        let query = supabase.from('fuel_expenses').select('*').order('date', { ascending: false });
        if (vehicleId) query = query.eq('vehicle_id', vehicleId);
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase getFuelExpenses warning:', err);
      }
    }
    const all = getLocalFuel();
    if (vehicleId) return all.filter(f => f.vehicle_id === vehicleId);
    return all;
  },

  async addFuelExpense(entry) {
    const totalCost = calculateTotalCost(entry.quantity, entry.price_per_litre);
    const payload = { ...entry, total_cost: totalCost };

    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('fuel_expenses')
          .insert([payload])
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase addFuelExpense fallback:', err);
      }
    }
    const all = getLocalFuel();
    const newEntry = {
      id: `fuel-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...payload
    };
    const updated = [newEntry, ...all];
    setLocalFuel(updated);
    return newEntry;
  }
};
