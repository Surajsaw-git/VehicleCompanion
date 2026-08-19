import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if valid URL & Key are provided
export const isConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('example.supabase.co') && 
  !supabaseAnonKey.includes('dummykey')
);

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
