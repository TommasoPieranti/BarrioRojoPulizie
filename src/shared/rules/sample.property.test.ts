import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { clamp } from './sample';

// Sample property test: proves fast-check works in this project.
// Replaced by the real rules tests (points, rotation, scores) in Phase 3.
describe('clamp (sample property test)', () => {
  it('always returns a value within [min, max]', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -1000, max: 1000 }),
        fc.integer({ min: -1000, max: 1000 }),
        fc.integer({ min: -1000, max: 1000 }),
        (value, a, b) => {
          const min = Math.min(a, b);
          const max = Math.max(a, b);
          const result = clamp(value, min, max);
          return result >= min && result <= max;
        },
      ),
      { numRuns: 200 },
    );
  });

  it('leaves values already inside the range unchanged', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        (value) => clamp(value, 0, 100) === value,
      ),
      { numRuns: 200 },
    );
  });

  it('is idempotent: clamping twice equals clamping once', () => {
    fc.assert(
      fc.property(fc.integer(), (value) => {
        const once = clamp(value, -10, 10);
        return clamp(once, -10, 10) === once;
      }),
      { numRuns: 200 },
    );
  });

  it('rejects an inverted range', () => {
    expect(() => clamp(5, 10, 0)).toThrow();
  });
});
