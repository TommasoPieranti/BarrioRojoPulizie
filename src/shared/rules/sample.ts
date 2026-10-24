// Trivial pure function used only to prove the property-testing setup works.
// Removed or replaced when the real rules module is built in Phase 3.
export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new RangeError(
      `Invalid range: min (${min}) is greater than max (${max})`,
    );
  }
  return Math.min(Math.max(value, min), max);
}
