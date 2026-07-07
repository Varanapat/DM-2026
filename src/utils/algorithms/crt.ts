import { gcd } from './euclidean';

export interface CrtCongruence {
  /** target residue */
  a: number;
  /** modulus */
  m: number;
}

export interface CrtCandidate {
  x: number;
  /** which congruences x satisfies */
  matched: boolean[];
  /** how many dials were already locked when x was tried (drives the jump size) */
  lockedBefore: number;
}

export interface CrtTrace {
  candidates: CrtCandidate[];
  solution: number | null;
  /** product of all moduli — the uniqueness period */
  M: number;
  coprime: boolean;
}

export function pairwiseCoprime(moduli: number[]): boolean {
  for (let i = 0; i < moduli.length; i++) {
    for (let j = i + 1; j < moduli.length; j++) {
      if (gcd(moduli[i], moduli[j]) !== 1) return false;
    }
  }
  return true;
}

/** Sieve-style CRT search: scan x upward, but once the first k congruences
 * lock, jump by the product of their moduli — each candidate records which
 * dials it matches so the visualizer can replay the narrowing. */
export function crtSearchSteps(pairs: CrtCongruence[]): CrtTrace {
  const norm = pairs.map(({ a, m }) => ({ m, a: ((a % m) + m) % m }));
  const M = norm.reduce((acc, { m }) => acc * m, 1);
  const coprime = pairwiseCoprime(norm.map(({ m }) => m));

  const candidates: CrtCandidate[] = [];
  let x = 0;
  let locked = 0;
  let stride = 1;

  while (x < M) {
    const matched = norm.map(({ a, m }) => x % m === a);
    candidates.push({ x, matched, lockedBefore: locked });

    // count how many congruences lock *in order* (dial k+1 only counts once 1..k hold)
    let inOrder = 0;
    while (inOrder < norm.length && matched[inOrder]) inOrder++;

    if (inOrder === norm.length) {
      return { candidates, solution: x, M, coprime };
    }
    if (inOrder > locked) {
      locked = inOrder;
      stride = norm.slice(0, locked).reduce((acc, { m }) => acc * m, 1);
    }
    x += stride;
  }

  return { candidates, solution: null, M, coprime };
}
