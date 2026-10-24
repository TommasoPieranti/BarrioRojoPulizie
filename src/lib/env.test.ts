import { describe, expect, it } from 'vitest';
import { EnvError, readSupabaseEnv } from '@/lib/env';

const validEnv = {
  VITE_SUPABASE_URL: 'https://abcdefgh.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'public-anon-key-value',
};

describe('readSupabaseEnv', () => {
  it('returns url and anon key when both values are valid', () => {
    expect(readSupabaseEnv(validEnv)).toEqual({
      url: 'https://abcdefgh.supabase.co',
      anonKey: 'public-anon-key-value',
    });
  });

  it('trims surrounding whitespace', () => {
    const result = readSupabaseEnv({
      VITE_SUPABASE_URL: '  https://abcdefgh.supabase.co  ',
      VITE_SUPABASE_ANON_KEY: '  key  ',
    });
    expect(result).toEqual({
      url: 'https://abcdefgh.supabase.co',
      anonKey: 'key',
    });
  });

  it.each([
    ['missing', undefined],
    ['empty', ''],
    ['blank', '   '],
  ])('throws an error naming the URL variable when it is %s', (_, value) => {
    expect(() =>
      readSupabaseEnv({ ...validEnv, VITE_SUPABASE_URL: value }),
    ).toThrow(EnvError);
    expect(() =>
      readSupabaseEnv({ ...validEnv, VITE_SUPABASE_URL: value }),
    ).toThrow(/VITE_SUPABASE_URL/);
  });

  it.each([
    ['missing', undefined],
    ['empty', ''],
    ['blank', '   '],
  ])('throws an error naming the key variable when it is %s', (_, value) => {
    expect(() =>
      readSupabaseEnv({ ...validEnv, VITE_SUPABASE_ANON_KEY: value }),
    ).toThrow(/VITE_SUPABASE_ANON_KEY/);
  });

  it.each([
    'http://abcdefgh.supabase.co',
    'not a url',
    'ftp://abcdefgh.supabase.co',
  ])('rejects a non-https URL: %s', (url) => {
    expect(() =>
      readSupabaseEnv({ ...validEnv, VITE_SUPABASE_URL: url }),
    ).toThrow(/VITE_SUPABASE_URL.*https/);
  });

  it('never includes the key value in an error message', () => {
    try {
      readSupabaseEnv({ ...validEnv, VITE_SUPABASE_URL: 'http://bad' });
      expect.unreachable('should have thrown');
    } catch (error) {
      expect(String(error)).not.toContain('public-anon-key-value');
    }
  });
});

describe('getSupabase', () => {
  it('importing the module without env values does not throw', async () => {
    await expect(import('@/lib/supabase')).resolves.toBeDefined();
  });

  it('returns a client when both values are valid, and reuses it', async () => {
    const { getSupabase, resetSupabaseForTests } =
      await import('@/lib/supabase');
    resetSupabaseForTests();
    const first = getSupabase(validEnv);
    const second = getSupabase(validEnv);
    expect(first).toBe(second);
    expect(typeof first.from).toBe('function');
    resetSupabaseForTests();
  });

  it('throws a named error when values are missing', async () => {
    const { getSupabase, resetSupabaseForTests } =
      await import('@/lib/supabase');
    resetSupabaseForTests();
    expect(() => getSupabase({})).toThrow(/VITE_SUPABASE_URL/);
  });
});
