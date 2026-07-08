import { describe, expect, it } from 'vitest';
import { computeXymMicros } from './orders';

describe('computeXymMicros', () => {
  it('converts JPY total to micro-XYM at the given JPY/XYM rate', () => {
    // 1000 JPY at 5 JPY/XYM = 200 XYM = 200_000_000 micro-XYM
    expect(computeXymMicros(1000, 5)).toBe(200_000_000);
  });

  it('rounds UP so the buyer never underpays', () => {
    // 100 / 3 = 33.3333.. XYM -> 33_333_333.33 micro -> ceil
    expect(computeXymMicros(100, 3)).toBe(33_333_334);
  });

  it('yields at least 1 micro-XYM for a tiny amount', () => {
    expect(computeXymMicros(1, 1_000_000)).toBe(1);
  });

  it('throws on a non-positive rate', () => {
    expect(() => computeXymMicros(1000, 0)).toThrow('invalid_rate');
    expect(() => computeXymMicros(1000, -1)).toThrow('invalid_rate');
  });
});
