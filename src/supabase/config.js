import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ljpjlukovkxxjknlvzad.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqcGpsdWtvdmt4eGprbmx2emFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MDUzNjQsImV4cCI6MjA4MzI4MTM2NH0.t1cmXumEnt6WNkMFcQ4sVXe64UdT_QdkhkeOe0KbySY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'depthub-auth-token',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
    global: {
        headers: {
            'x-custom-client': 'depthub-web'
        }
    },
    db: {
        schema: 'public'
    }
});

export default supabase;
