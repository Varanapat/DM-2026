import { gcdSteps, type EuclideanStep } from './euclidean';

export interface BackSubRow {
  /** the (a, b) pair this equation is expressed in: gcd = x·a + y·b */
  a: number;
  b: number;
  x: number;
  y: number;
}

export interface ExtGcdTrace {
  forward: EuclideanStep[];
  /** substitution rows from the gcd row upward, ending at the original (a, b) */
  back: BackSubRow[];
  gcd: number;
  x: number;
  y: number;
}

/** Forward Euclidean rows plus the back-substitution trail: each back row
 * rewrites gcd = x·a + y·b one level closer to the original inputs. */
export function extGcdSteps(a: number, b: number): ExtGcdTrace {
  const forward = gcdSteps(Math.max(a, b), Math.min(a, b));
  if (forward.length === 0) {
    const g = Math.abs(Math.trunc(a)) || Math.abs(Math.trunc(b));
    return { forward, back: [], gcd: g, x: 1, y: 0 };
  }

  const g = forward[forward.length - 1].b;

  // Last row with remainder > 0 seeds the equation: g = a_k − q_k·b_k.
  // (If the very first division is exact, b divides a: g = b = 0·a + 1·b.)
  const seedIndex = forward.length >= 2 ? forward.length - 2 : -1;
  const back: BackSubRow[] = [];

  let x: number;
  let y: number;
  if (seedIndex < 0) {
    x = 0;
    y = 1;
    back.push({ a: forward[0].a, b: forward[0].b, x, y });
  } else {
    x = 1;
    y = -forward[seedIndex].quotient;
    back.push({ a: forward[seedIndex].a, b: forward[seedIndex].b, x, y });
    // climb: row i has b_i = r_{i} where (a_{i+1}, b_{i+1}) = (b_i, r_i),
    // so substituting r_{i-1} = a_{i-1} − q_{i-1}·b_{i-1} moves one level up.
    for (let i = seedIndex - 1; i >= 0; i--) {
      const row = forward[i];
      const newX = y;
      const newY = x - y * row.quotient;
      x = newX;
      y = newY;
      back.push({ a: row.a, b: row.b, x, y });
    }
  }

  return { forward, back, gcd: g, x, y };
}
