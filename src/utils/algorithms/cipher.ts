const ALPHABET_SIZE = 26;

export interface CipherLetterStep {
  index: number;
  plainChar: string;
  plainNum: number | null;
  cipherNum: number | null;
  cipherChar: string;
}

export type CipherMode = 'shift' | 'affine';

function letterToNum(ch: string): number | null {
  const upper = ch.toUpperCase();
  if (upper < 'A' || upper > 'Z') return null;
  return upper.charCodeAt(0) - 65;
}

function numToLetter(n: number): string {
  return String.fromCharCode((((n % ALPHABET_SIZE) + ALPHABET_SIZE) % ALPHABET_SIZE) + 65);
}

/** Modular inverse of a mod m via brute search (m is always 26 here, so this is cheap
 * and keeps the dependency on Extended Euclidean conceptual rather than re-implementing it). */
export function modInverse(a: number, m: number): number | null {
  const base = ((a % m) + m) % m;
  for (let x = 1; x < m; x++) {
    if ((base * x) % m === 1) return x;
  }
  return null;
}

/** Encrypts a message letter-by-letter. Shift: E(p) = (p + b) mod 26.
 * Affine: E(p) = (a·p + b) mod 26 — requires gcd(a, 26) = 1 to be reversible. */
export function encryptSteps(text: string, mode: CipherMode, a: number, b: number): CipherLetterStep[] {
  return [...text].map((ch, i) => {
    const p = letterToNum(ch);
    if (p === null) {
      return { index: i, plainChar: ch, plainNum: null, cipherNum: null, cipherChar: ch };
    }
    const c = mode === 'shift' ? (p + b) % ALPHABET_SIZE : (a * p + b) % ALPHABET_SIZE;
    return { index: i, plainChar: ch, plainNum: p, cipherNum: c, cipherChar: numToLetter(c) };
  });
}
