import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY ??
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('SUPABASE_URL is missing from environment variables');
}

if (!supabaseSecretKey) {
  throw new Error(
    'SUPABASE_SECRET_KEY (or legacy SUPABASE_SERVICE_ROLE_KEY) is missing from environment variables',
  );
}

const serverSupabaseUrl = supabaseUrl;
const serverSupabaseSecretKey = supabaseSecretKey;

export function createServerSupabaseClient() {
  return createClient(
    serverSupabaseUrl,
    serverSupabaseSecretKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
}

export const supabase =
  createServerSupabaseClient();
