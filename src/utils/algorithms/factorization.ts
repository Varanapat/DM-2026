export function smallestFactor(n: number): number {
  const abs = Math.abs(Math.trunc(n));
  if (abs < 2) return abs;
  if (abs % 2 === 0) return 2;
  for (let d = 3; d * d <= abs; d += 2) {
    if (abs % d === 0) return d;
  }
  return abs;
}

export function isPrime(n: number): boolean {
  const abs = Math.trunc(n);
  return abs >= 2 && smallestFactor(abs) === abs;
}

export interface FactorStep {
  /** the composite being split this step */
  value: number;
  factor: number;
  cofactor: number;
}

/** Chain of splits peeling the given (or smallest) prime off the running
 * cofactor until it reaches a prime — the auto-mode factor-tree trace.
 * 360 → [360=2×180, 180=2×90, 90=2×45, 45=3×15, 15=3×5]. */
export function factorSteps(n: number, firstFactor?: number): FactorStep[] {
  let value = Math.abs(Math.trunc(n));
  const steps: FactorStep[] = [];
  if (value < 2) return steps;

  if (firstFactor && firstFactor > 1 && firstFactor < value && value % firstFactor === 0) {
    steps.push({ value, factor: firstFactor, cofactor: value / firstFactor });
    value = value / firstFactor;
  }

  while (!isPrime(value) && value > 1) {
    const factor = smallestFactor(value);
    const cofactor = value / factor;
    steps.push({ value, factor, cofactor });
    value = cofactor;
  }

  return steps;
}

export interface PrimePower {
  prime: number;
  exponent: number;
}

/** Canonical form n = p1^e1 · p2^e2 · …, primes ascending. */
export function primeFactorization(n: number): PrimePower[] {
  let value = Math.abs(Math.trunc(n));
  const powers: PrimePower[] = [];
  while (value > 1) {
    const p = smallestFactor(value);
    let exponent = 0;
    while (value % p === 0) {
      value /= p;
      exponent++;
    }
    powers.push({ prime: p, exponent });
  }
  return powers;
}
