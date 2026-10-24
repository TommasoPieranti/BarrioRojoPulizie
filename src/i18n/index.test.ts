import { describe, expect, it } from 'vitest';
import { it as italian } from '@/i18n/it';
import { t } from '@/i18n';

describe('t()', () => {
  it('returns the Italian string for a known key', () => {
    expect(t('common.appName')).toBe('Gestione Casa');
  });

  it('returns the same value as the central text file', () => {
    expect(t('home.title')).toBe(italian.home.title);
  });

  it('throws a clear error for an unknown key', () => {
    // @ts-expect-error - unknown keys must be a compile error as well
    expect(() => t('does.not.exist')).toThrow(/does\.not\.exist/);
  });

  it('has no empty strings in the text file', () => {
    const empty: string[] = [];
    const walk = (node: unknown, path: string) => {
      if (typeof node === 'string') {
        if (node.trim() === '') empty.push(path);
      } else if (node && typeof node === 'object') {
        for (const [key, value] of Object.entries(node)) {
          walk(value, path ? `${path}.${key}` : key);
        }
      }
    };
    walk(italian, '');
    expect(empty).toEqual([]);
  });
});
