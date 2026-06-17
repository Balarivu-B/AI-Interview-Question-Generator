import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        signUp: () => { console.warn('Supabase not configured. Using backend auth.'); return null; },
        signInWithPassword: () => { console.warn('Supabase not configured. Using backend auth.'); return null; },
        signOut: () => { console.warn('Supabase not configured.'); return null; },
      }
    };

export default supabase;
