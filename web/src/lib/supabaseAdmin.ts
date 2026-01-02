import { createClient } from "@supabase/supabase-js";

import { optionalEnv, requiredEnv } from "@/lib/env";

export function createSupabaseAdmin() {
  const url = requiredEnv("SUPABASE_URL");
  const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getStorageBucketName(): string {
  return optionalEnv("SUPABASE_STORAGE_BUCKET") ?? "rose-bowl-media";
}

