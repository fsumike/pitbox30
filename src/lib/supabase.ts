import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`Invalid VITE_SUPABASE_URL format: ${supabaseUrl}`);
}

// Enhanced fetch with better error handling and diagnostics
const customFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // Increased to 30 seconds
  
  try {

    // Ensure apikey header is always present
    const headers = new Headers(init?.headers);
    if (!headers.has('apikey')) {
      headers.set('apikey', supabaseAnonKey);
    }
    if (!headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${supabaseAnonKey}`);
    }

    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
      headers,
    });

    clearTimeout(timeoutId);

    // Log response status for debugging (development only)
    if (import.meta.env.DEV) {
      }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Enhanced error reporting
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('Supabase request timeout:', { url: input, timeout: '30s' });
      throw error;
    }
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('Supabase network error:', {
        url: input,
        supabaseUrl,
        error: error.message,
        userAgent: navigator.userAgent,
        online: navigator.onLine
      });
      
      // Check if we're offline
      if (!navigator.onLine) {
        throw error;
      }
      
      // Check if it's a CORS issue
      if (typeof input === 'string' && input.includes(supabaseUrl)) {
        throw error;
      }
      
      throw error;
    }
    
    console.error('Supabase request error:', error);
    throw error;
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: customFetch
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

export const testSupabaseConnection = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok && response.status !== 404) {
      return { success: false, error: `Server returned ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { success: false, error: 'Connection timed out' };
    }
    if (!navigator.onLine) {
      return { success: false, error: 'No internet connection' };
    }
    return { success: true };
  }
};

export type Profile = {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  promo_code?: string;
  has_premium?: boolean;
};

export type Setup = {
  id: string;
  user_id: string;
  car_type: string;
  car_number: string | null;
  track_name: string | null;
  track_conditions: Record<string, any>;
  setup_data: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type DynoImage = {
  id: string;
  user_id: string;
  setup_id?: string | null;
  type: 'motor' | 'shock';
  url: string;
  created_at: string;
};