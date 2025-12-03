/**
 * Supabase Edge Runtime compatible client
 * This file is used in Next.js Edge API routes and middleware
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Create a Supabase client for Edge Runtime
 * Compatible with Vercel Edge Functions and middleware
 */
export function createEdgeSupabaseClient(
  options?: {
    serviceRole?: boolean;
  }
): SupabaseClient<Database> {
  const key = options?.serviceRole 
    ? process.env.SUPABASE_SERVICE_ROLE_KEY! 
    : supabaseAnonKey;

  return createClient<Database>(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
