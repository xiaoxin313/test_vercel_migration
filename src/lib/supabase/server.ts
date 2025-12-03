import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Supabase Admin client for server-side usage
 * Uses the service role key - bypasses RLS
 * Only use in server actions, API routes, and server components
 */
export function createServerSupabaseClient() {
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Get server Supabase client singleton
 */
let serverClient: ReturnType<typeof createClient<Database>> | null = null;

export function getServerSupabase() {
  if (!serverClient) {
    serverClient = createServerSupabaseClient();
  }
  return serverClient;
}

