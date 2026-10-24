import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { readSupabaseEnv } from '@/lib/env';

let client: SupabaseClient | null = null;

// The client is created on first use, never at import time, so the app shell,
// unit tests and CI work without any environment values.
export function getSupabase(
  raw: Record<string, unknown> = import.meta.env,
): SupabaseClient {
  if (client) return client;
  const { url, anonKey } = readSupabaseEnv(raw);
  client = createClient(url, anonKey);
  return client;
}

export function resetSupabaseForTests(): void {
  client = null;
}
