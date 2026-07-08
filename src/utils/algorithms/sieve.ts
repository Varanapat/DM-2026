export interface SieveRound {
  prime: number;
  /** multiples crossed out this round (starting at prime², skipping already-crossed) */
  crossed: number[];
  firstCross: number | null;
}

/** One round per base prime p ≤ √max, mirroring how the sieve is taught:
 * each round crosses out the multiples of p that survived earlier rounds. */
export function sieveRounds(max: number): SieveRound[] {
  const limit = Math.max(Math.trunc(max), 2);
  const crossedBy = new Array<number>(limit + 1).fill(0);
  const rounds: SieveRound[] = [];

  for (let p = 2; p * p <= limit; p++) {
    if (crossedBy[p] !== 0) continue;
    const crossed: number[] = [];
    for (let m = p * p; m <= limit; m += p) {
      if (crossedBy[m] === 0) {
        crossedBy[m] = p;
        crossed.push(m);
      }
    }
    rounds.push({ prime: p, crossed, firstCross: crossed[0] ?? null });
  }

  return rounds;
}

export function primesUpTo(max: number): number[] {
  const limit = Math.max(Math.trunc(max), 1);
  const crossed = new Array<boolean>(limit + 1).fill(false);
  const primes: number[] = [];
  for (let p = 2; p <= limit; p++) {
    if (crossed[p]) continue;
    primes.push(p);
    for (let m = p * p; m <= limit; m += p) crossed[m] = true;
  }
  return primes;
}
