export interface LcgTerm {
  index: number;
  value: number;
  /** true once this value has appeared earlier in the sequence — marks the start of the repeating period */
  isRepeat: boolean;
}

/** Linear Congruential Generator: x(n+1) = (a·x(n) + c) mod m.
 * Stops as soon as a value repeats (the sequence is now guaranteed to cycle
 * forever, since the next term only depends on the current one). */
export function lcgSequence(a: number, c: number, m: number, seed: number, maxTerms: number): LcgTerm[] {
  const modulus = Math.max(m, 1);
  const seen = new Set<number>();
  const terms: LcgTerm[] = [];

  let x = ((seed % modulus) + modulus) % modulus;
  seen.add(x);
  terms.push({ index: 0, value: x, isRepeat: false });

  for (let i = 1; i < maxTerms; i++) {
    x = ((a * x + c) % modulus + modulus) % modulus;
    const isRepeat = seen.has(x);
    terms.push({ index: i, value: x, isRepeat });
    if (isRepeat) break;
    seen.add(x);
  }

  return terms;
}
