import { it } from './it';

type Join<K extends string, P extends string> = `${K}.${P}`;

// Union of every dot-path that ends in a string, e.g. 'home.title'.
type Paths<T> = T extends string
  ? never
  : {
      [K in keyof T & string]: T[K] extends string
        ? K
        : Join<K, Paths<T[K]> & string>;
    }[keyof T & string];

export type TextKey = Paths<typeof it>;

/**
 * Returns the Italian text for a key. Unknown keys are a compile error,
 * and throw a clear error at runtime so a typo never shows up as blank text.
 */
export function t(key: TextKey): string {
  let node: unknown = it;
  for (const part of key.split('.')) {
    if (node && typeof node === 'object' && part in node) {
      node = (node as Record<string, unknown>)[part];
    } else {
      throw new Error(`Missing text key: ${key}`);
    }
  }
  if (typeof node !== 'string') {
    throw new Error(`Text key does not point to a string: ${key}`);
  }
  return node;
}
