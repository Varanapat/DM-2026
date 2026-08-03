import { gcd } from './euclidean';
import { primeFactorization } from './factorization';

export function modPow(a: number, e: number, n: number): number {
  const base = ((Math.trunc(a) % n) + n) % n;
  let exp = Math.max(Math.trunc(e), 0);
  let result = 1 % n;
  let power = base;
  while (exp > 0) {
    if (exp & 1) result = (result * power) % n;
    power = (power * power) % n;
    exp >>= 1;
  }
  return result;
}

export interface ModPowStep {
  /** bit position counted from MSB (0 = leftmost) */
  bitIndex: number;
  bit: 0 | 1;
  /** result after the square (null on the very first bit — nothing to square yet) */
  squared: number | null;
  /** result after the conditional multiply (null when bit = 0) */
  multiplied: number | null;
  /** register value at the end of this bit's step */
  result: number;
}

/** MSB-first square-and-multiply trace: one step per binary digit of e. */
export function modPowSteps(a: number, e: number, n: number): { bits: (0 | 1)[]; steps: ModPowStep[]; result: number } {
  const base = ((Math.trunc(a) % n) + n) % n;
  const exp = Math.max(Math.trunc(e), 0);
  const bits = exp
    .toString(2)
    .split('')
    .map((c) => (c === '1' ? 1 : 0) as 0 | 1);

  const steps: ModPowStep[] = [];
  let result = 1 % n;
  bits.forEach((bit, bitIndex) => {
    const squared = bitIndex === 0 ? null : (result * result) % n;
    let current = squared ?? result;
    const multiplied = bit === 1 ? (current * base) % n : null;
    if (multiplied !== null) current = multiplied;
    result = current;
    steps.push({ bitIndex, bit, squared, multiplied, result });
  });

  return { bits, steps, result };
}

/** gcd(k, n) for every k in 1..n — the totient scan trace. */
export function gcdTable(n: number): { k: number; g: number }[] {
  const size = Math.max(Math.trunc(n), 1);
  return Array.from({ length: size }, (_, i) => {
    const k = i + 1;
    return { k, g: gcd(k, size) };
  });
}

export function totient(n: number): number {
  return gcdTable(n).filter(({ g }) => g === 1).length;
}

/** φ(n) = n · ∏ (1 − 1/p) — returned per-factor so the formula can assemble term by term. */
export function totientFormula(n: number): { prime: number; exponent: number }[] {
  return primeFactorization(n);
}

/** Positions of a¹, a², …, a^count (mod p) — the Fermat multiply-trail. */
export function multiplyTrail(a: number, p: number, count: number): number[] {
  const positions: number[] = [];
  let value = 1;
  for (let i = 0; i < count; i++) {
    value = (value * a) % p;
    positions.push(value);
  }
  return positions;
}
