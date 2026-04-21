import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function getEnvValue(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

type CookieOptions = {
  domain?: string;
  path?: string;
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
};

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

export async function getSupabaseServerAuthClient(): Promise<SupabaseClient> {
  const supabaseUrl = getEnvValue("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = getEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll().map((cookie) => ({
          name: cookie.name,
          value: cookie.value,
        }));
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach((cookie) => {
            cookieStore.set({
              name: cookie.name,
              value: cookie.value,
              ...cookie.options,
            });
          });
        } catch {
          // Ignore cookie mutations in server components.
        }
      },
    },
  });
}
