export interface CheckDigitStep {
  position: number;
  digit: number;
  weight: 3 | 1;
  product: number;
}

/** UPC-A weighting: odd positions (1st, 3rd, ...) ×3, even positions ×1. */
export function upcCheckDigitSteps(digits: number[]): CheckDigitStep[] {
  return digits.map((digit, i) => {
    const position = i + 1;
    const weight: 3 | 1 = position % 2 === 1 ? 3 : 1;
    return { position, digit, weight, product: digit * weight };
  });
}

export function computeUpcCheckDigit(digits: number[]): number {
  const sum = upcCheckDigitSteps(digits).reduce((acc, s) => acc + s.product, 0);
  return (10 - (sum % 10)) % 10;
}

export interface Isbn10Step {
  position: number;
  digit: number;
  weight: number;
  product: number;
}

/** ISBN-10 weighting: 9 data digits weighted 10 down to 2, mod 11 — the
 * check digit can land on 10, printed as the letter X. */
export function isbn10Steps(digits: number[]): Isbn10Step[] {
  return digits.map((digit, i) => {
    const position = i + 1;
    const weight = 10 - i;
    return { position, digit, weight, product: digit * weight };
  });
}

/** Returns 0–10; 10 represents the check character X. */
export function computeIsbn10CheckDigit(digits: number[]): number {
  const sum = isbn10Steps(digits).reduce((acc, s) => acc + s.product, 0);
  return (11 - (sum % 11)) % 11;
}

export function isbn10CheckChar(value: number): string {
  return value === 10 ? 'X' : String(value);
}
