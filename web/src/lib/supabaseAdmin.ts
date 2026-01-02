import { createClient } from "@supabase/supabase-js";

import { optionalEnv } from "@/lib/env";

function getEnvVar(...names: string[]): string {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim().length > 0) {
      return value;
    }
  }
  throw new Error(
    `Missing required environment variable. Tried: ${names.join(", ")}. See web/README.md for setup.`,
  );
}

export function createSupabaseAdmin() {
  // Use NEXT_PUBLIC_ variables, with fallback to non-prefixed for backwards compatibility
  const url = getEnvVar("NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL");
  
  // Prefer service role key (server-only), fallback to publishable key
  const serviceRoleKey = getEnvVar(
    "SUPABASE_SERVICE_ROLE_KEY",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
  );

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getStorageBucketName(): string {
  return optionalEnv("SUPABASE_STORAGE_BUCKET") ?? "rose-bowl-media";
}

