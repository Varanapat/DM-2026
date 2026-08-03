export interface EuclideanStep {
  /** the a, b at the start of this step, before reducing */
  a: number;
  b: number;
  quotient: number;
  remainder: number;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y !== 0) {
    [x, y] = [y, x % y];
  }
  return x;
}

/** Full trace of the Euclidean algorithm: one entry per a,b pair encountered,
 * ending once b reaches 0 (gcd = last non-zero b's step `a`... i.e. steps.at(-1).b before the final 0). */
export function gcdSteps(a: number, b: number): EuclideanStep[] {
  const steps: EuclideanStep[] = [];
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));

  if (y === 0) {
    return steps;
  }

  while (y !== 0) {
    const quotient = Math.floor(x / y);
    const remainder = x % y;
    steps.push({ a: x, b: y, quotient, remainder });
    x = y;
    y = remainder;
  }

  return steps;
}

export function lcm(a: number, b: number): number {
  const x = Math.abs(Math.trunc(a));
  const y = Math.abs(Math.trunc(b));
  if (x === 0 || y === 0) return 0;
  return (x / gcd(x, y)) * y;
}

export interface MultipleEntry {
  value: number;
  ofA: boolean;
  ofB: boolean;
}

/** Multiples of a and b merged in ascending order, ending at lcm(a,b) —
 * the "two trains meet" trace for the LCM visualizer. */
export function multiplesUntilLcm(a: number, b: number): MultipleEntry[] {
  const target = lcm(a, b);
  if (target === 0) return [];
  const entries: MultipleEntry[] = [];
  for (let v = 1; v <= target; v++) {
    const ofA = v % a === 0;
    const ofB = v % b === 0;
    if (ofA || ofB) entries.push({ value: v, ofA, ofB });
  }
  return entries;
}

/** Worst-case number of checks a naive "try every candidate divisor" approach
 * needs — used only for the naive-vs-fast step-count comparison widget. */
export function naiveDivisorCheckCount(a: number, b: number): number {
  return Math.max(Math.min(Math.abs(a), Math.abs(b)), 1);
}

/** All positive divisors of n, ascending — used for the "list every divisor"
 * naive-method illustration (only meant for small teaching examples). */
export function divisors(n: number): number[] {
  const abs = Math.max(Math.abs(Math.trunc(n)), 1);
  const result: number[] = [];
  for (let i = 1; i <= abs; i++) {
    if (abs % i === 0) result.push(i);
  }
  return result;
}
