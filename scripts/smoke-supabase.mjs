// Connectivity check for the Supabase project using the PUBLIC anon key only.
// Reads .env (or real environment variables). Never prints the key.
import { existsSync, readFileSync } from 'node:fs';

function loadDotEnv(path) {
  const values = {};
  if (!existsSync(path)) return values;
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (match && !line.trimStart().startsWith('#')) {
      values[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    }
  }
  return values;
}

const env = { ...loadDotEnv('.env'), ...process.env };
const url = env.VITE_SUPABASE_URL?.trim();
const anonKey = env.VITE_SUPABASE_ANON_KEY?.trim();

if (!url || !anonKey) {
  console.error(
    'FAIL: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set (see .env.example).',
  );
  process.exit(1);
}
if (!url.startsWith('https://')) {
  console.error('FAIL: VITE_SUPABASE_URL must start with https://');
  process.exit(1);
}

const base = url.replace(/\/+$/, '');
const checks = [
  { name: 'auth service', path: '/auth/v1/health' },
  { name: 'database API', path: '/rest/v1/' },
];

let failed = false;
for (const check of checks) {
  try {
    const response = await fetch(`${base}${check.path}`, {
      headers: { apikey: anonKey },
    });
    // 200 = reachable. 401/403 on the REST root also proves the project answered
    // and checked the key (schema listing is restricted for the anon role).
    const reachable =
      response.status === 200 ||
      (check.path.startsWith('/rest') && [401, 403].includes(response.status));
    console.log(
      `${reachable ? 'OK  ' : 'FAIL'} ${check.name}: HTTP ${response.status}`,
    );
    if (!reachable) failed = true;
  } catch (error) {
    console.log(`FAIL ${check.name}: ${error.cause?.code ?? error.message}`);
    failed = true;
  }
}

console.log(`Project host: ${new URL(base).host}`);
process.exit(failed ? 1 : 0);
