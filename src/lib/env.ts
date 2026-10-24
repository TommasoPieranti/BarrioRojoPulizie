// Validates the public Supabase settings. Both values are PUBLIC by design (they ship
// in the browser bundle). The service_role key must never be used here or anywhere
// in client code.

export class EnvError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvError';
  }
}

export interface SupabaseEnv {
  url: string;
  anonKey: string;
}

type RawEnv = Record<string, unknown>;

function readRequired(raw: RawEnv, name: string): string {
  const value = raw[name];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new EnvError(
      `Missing environment variable ${name}. See .env.example.`,
    );
  }
  return value.trim();
}

// Error messages name the variable but never print its value.
export function readSupabaseEnv(raw: RawEnv): SupabaseEnv {
  const url = readRequired(raw, 'VITE_SUPABASE_URL');
  const anonKey = readRequired(raw, 'VITE_SUPABASE_ANON_KEY');

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new EnvError('VITE_SUPABASE_URL must be a valid https URL.');
  }
  if (parsed.protocol !== 'https:') {
    throw new EnvError('VITE_SUPABASE_URL must be a valid https URL.');
  }

  return { url, anonKey };
}
