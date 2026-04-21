import { createBrowserClient } from "@supabase/ssr";
import { type SupabaseClient } from "@supabase/supabase-js";

const globalForSupabase = globalThis as typeof globalThis & {
  __supabaseBrowserClient?: SupabaseClient;
};

/**
 * Browser-side Supabase client helper.
 * - Uses public environment variables.
 * - Safe to call from Client Components and browser-only utilities.
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  if (globalForSupabase.__supabaseBrowserClient) {
    return globalForSupabase.__supabaseBrowserClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not set");
  }

  globalForSupabase.__supabaseBrowserClient = createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );

  return globalForSupabase.__supabaseBrowserClient;
}

export type { SupabaseClient };
