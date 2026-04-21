import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedServerClient: SupabaseClient | null = null;

function getEnvValue(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Server-side Supabase client helper.
 * - Uses server-only environment variables.
 * - Safe to call from Server Components, route handlers, and server utilities.
 */
export function getSupabaseServerClient(): SupabaseClient {
  if (cachedServerClient) {
    return cachedServerClient;
  }

  const supabaseUrl = getEnvValue("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!anonKey) {
    throw new Error(
      "Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY (ensure NEXT_PUBLIC_SUPABASE_URL is set)"
    );
  }

  cachedServerClient = createClient(supabaseUrl, anonKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedServerClient;
}

export type { SupabaseClient };
