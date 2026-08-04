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
