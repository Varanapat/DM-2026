export interface BaseConversionStep {
  dividend: number;
  quotient: number;
  remainder: number;
}

const DIGIT_CHARS = '0123456789ABCDEF';

/** Repeated-division-by-base algorithm: divide by the base, keep the remainder
 * as the next digit, continue with the quotient until it reaches 0. Digits
 * come out least-significant-first, so the final answer reads the steps in
 * reverse (last step's remainder = most significant digit). */
export function baseConversionSteps(n: number, base: number): BaseConversionStep[] {
  const steps: BaseConversionStep[] = [];
  let q = Math.trunc(Math.max(n, 0));

  if (q === 0) {
    return [{ dividend: 0, quotient: 0, remainder: 0 }];
  }

  while (q > 0) {
    const dividend = q;
    const remainder = dividend % base;
    q = Math.floor(dividend / base);
    steps.push({ dividend, quotient: q, remainder });
  }

  return steps;
}

export function digitChar(value: number): string {
  return DIGIT_CHARS[value] ?? '?';
}

/** Assembles the collected remainders (most-significant digit first) into the final string. */
export function digitsToString(steps: BaseConversionStep[]): string {
  return steps
    .slice()
    .reverse()
    .map((s) => digitChar(s.remainder))
    .join('');
}
