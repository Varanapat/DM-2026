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

export interface ExpRoundStep {
  /** 1-based round number */
  round: number;
  exponentBefore: number;
  isOdd: boolean;
  resultBefore: number;
  /** same as resultBefore when exponentBefore is even (multiply skipped) */
  resultAfter: number;
  baseBefore: number;
  /** baseBefore² before the mod reduction */
  baseSquared: number;
  baseAfter: number;
  exponentAfter: number;
}

export interface RightToLeftExpTrace {
  base: number;
  n: number;
  steps: ExpRoundStep[];
  result: number;
}

/** Classic right-to-left (LSB-first) binary exponentiation: each round checks
 * whether the exponent is odd (multiply result by base if so), squares the
 * base, and halves the exponent — repeated until the exponent reaches 0. */
export function rightToLeftExponentiationTrace(a: number, e: number, n: number): RightToLeftExpTrace {
  const base0 = ((Math.trunc(a) % n) + n) % n;
  let exponent = Math.max(Math.trunc(e), 0);
  let result = 1 % n;
  let base = base0;
  const steps: ExpRoundStep[] = [];
  let round = 1;

  while (exponent > 0) {
    const exponentBefore = exponent;
    const isOdd = exponentBefore % 2 === 1;
    const resultBefore = result;
    const resultAfter = isOdd ? (result * base) % n : result;
    const baseBefore = base;
    const baseSquared = base * base;
    const baseAfter = baseSquared % n;
    const exponentAfter = Math.floor(exponentBefore / 2);

    steps.push({ round, exponentBefore, isOdd, resultBefore, resultAfter, baseBefore, baseSquared, baseAfter, exponentAfter });

    result = resultAfter;
    base = baseAfter;
    exponent = exponentAfter;
    round++;
  }

  return { base: base0, n, steps, result };
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
