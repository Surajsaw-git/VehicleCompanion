import { supabase, isConfigured } from './supabase';
import { DEMO_GARAGES } from '../utils/seedData';

const LOCAL_KEY = 'vehicle_companion_garages';

function getLocalGarages() {
  const saved = localStorage.getItem(LOCAL_KEY);
  if (saved) {
    try { return JSON.parse(saved); } catch (e) { /* ignore */ }
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(DEMO_GARAGES));
  return DEMO_GARAGES;
}

export const garageService = {
  async getGarages() {
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('garages')
          .select('*');
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase getGarages warning:', err);
      }
    }
    return getLocalGarages();
  }
};
