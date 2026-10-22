import { createClient } from '@supabase/supabase-js';

// Standard Vite environment variable access with process level fallback
const getEnvVar = (metaKey: string, processName: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[metaKey]) {
    return import.meta.env[metaKey];
  }
  // Try to read compiled/injected process.env
  try {
    const val = (process as any).env[processName];
    if (val) return val;
  } catch (e) {}
  
  return '';
};

// Helper to extract Supabase project ref from JWT token payload
const getProjectRefFromKey = (key: string): string | null => {
  try {
    if (!key || typeof key !== 'string' || !key.includes('.')) return null;
    const parts = key.split('.');
    if (parts.length >= 2) {
      let b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      const json = typeof atob !== 'undefined' 
        ? atob(b64) 
        : Buffer.from(b64, 'base64').toString('utf8');
      const payload = JSON.parse(json);
      return payload.ref || null;
    }
  } catch (e) {}
  return null;
};

const rawKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY') || getEnvVar('VITE_SUPABASE_ANON_KEY', 'SUPABASE_KEY') || '';
const rawUrl = getEnvVar('VITE_SUPABASE_URL', 'VITE_SUPABASE_URL') || getEnvVar('VITE_SUPABASE_URL', 'SUPABASE_URL') || getEnvVar('NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL') || '';

// Smart alignment: If JWT key specifies a project ref, ensure URL points to that project
let resolvedUrl = rawUrl;
const keyProjectRef = getProjectRefFromKey(rawKey);

if (keyProjectRef) {
  const expectedUrl = `https://${keyProjectRef}.supabase.co`;
  if (!resolvedUrl || resolvedUrl.includes('placeholder') || !resolvedUrl.includes(keyProjectRef)) {
    console.info(`[SupabaseClient] Aligning Supabase URL with API key project reference: ${expectedUrl}`);
    resolvedUrl = expectedUrl;
  }
}

const supabaseUrl = resolvedUrl || 'https://placeholder-project.supabase.co';
const supabaseKey = rawKey || 'placeholder-key';

if (supabaseUrl.includes('placeholder') || !supabaseKey || supabaseKey === 'placeholder-key') {
  console.warn('Supabase credentials missing or invalid. App will run in Mock Mode.');
}

// Ensure createClient is called with a dummy url if keys are missing to prevent crash
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  }
});

// Global listener to handle session errors
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed successfully');
  }
  if (event === 'SIGNED_OUT') {
    // Clear any local storage that might be stale
    console.log('User signed out, clearing local storage');
  }
});

// Diagnostic check
export const checkConnection = async () => {
    try {
        const { data, error } = await supabase.from('profiles').select('id').limit(1);
        if (error) {
            console.error('Supabase connection test failed:', error);
            return false;
        }
        console.log('Supabase connection test successful');
        return true;
    } catch (e) {
        console.error('Supabase connection test exception:', e);
        return false;
    }
};

export const isSupabaseConfigured = !!supabaseUrl && 
                                   !supabaseUrl.includes('placeholder') && 
                                   !!supabaseKey && 
                                   supabaseKey !== 'placeholder-key' && 
                                   !supabaseKey.startsWith('sb_publishable_');
