import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

/** Maps each TOPIC_ORDER id (src/data/topics.ts) to its page component.
 * Pages are lazy so each topic's visualizer ships as its own chunk. */
export const TOPIC_PAGE_COMPONENTS: Record<string, LazyExoticComponent<ComponentType>> = {
  divisibility: lazy(() => import('@/pages/topics/DivisibilityPage').then((m) => ({ default: m.DivisibilityPage }))),
  'integer-representations': lazy(() =>
    import('@/pages/topics/IntegerRepresentationsPage').then((m) => ({ default: m.IntegerRepresentationsPage })),
  ),
  primes: lazy(() => import('@/pages/topics/PrimesPage').then((m) => ({ default: m.PrimesPage }))),
  'sieve-of-eratosthenes': lazy(() =>
    import('@/pages/topics/SieveOfEratosthenesPage').then((m) => ({ default: m.SieveOfEratosthenesPage })),
  ),
  'gcd-euclidean': lazy(() => import('@/pages/topics/GcdEuclideanPage').then((m) => ({ default: m.GcdEuclideanPage }))),
  'gcd-prime-factorization': lazy(() =>
    import('@/pages/topics/GcdPrimeFactorizationPage').then((m) => ({ default: m.GcdPrimeFactorizationPage })),
  ),
  'prime-factorization': lazy(() =>
    import('@/pages/topics/PrimeFactorizationPage').then((m) => ({ default: m.PrimeFactorizationPage })),
  ),
  'modular-arithmetic': lazy(() =>
    import('@/pages/topics/ModularArithmeticPage').then((m) => ({ default: m.ModularArithmeticPage })),
  ),
  congruence: lazy(() => import('@/pages/topics/CongruencePage').then((m) => ({ default: m.CongruencePage }))),
  'pseudorandom-numbers': lazy(() =>
    import('@/pages/topics/PseudorandomNumbersPage').then((m) => ({ default: m.PseudorandomNumbersPage })),
  ),
  'check-digits': lazy(() => import('@/pages/topics/CheckDigitsPage').then((m) => ({ default: m.CheckDigitsPage }))),
  'fast-modular-exponentiation': lazy(() =>
    import('@/pages/topics/FastModularExponentiationPage').then((m) => ({ default: m.FastModularExponentiationPage })),
  ),
  'euler-totient': lazy(() => import('@/pages/topics/EulerTotientPage').then((m) => ({ default: m.EulerTotientPage }))),
  'fermats-little-theorem': lazy(() =>
    import('@/pages/topics/FermatsLittleTheoremPage').then((m) => ({ default: m.FermatsLittleTheoremPage })),
  ),
  'extended-euclidean': lazy(() =>
    import('@/pages/topics/ExtendedEuclideanPage').then((m) => ({ default: m.ExtendedEuclideanPage })),
  ),
  'classical-ciphers': lazy(() =>
    import('@/pages/topics/ClassicalCiphersPage').then((m) => ({ default: m.ClassicalCiphersPage })),
  ),
  'chinese-remainder-theorem': lazy(() =>
    import('@/pages/topics/ChineseRemainderTheoremPage').then((m) => ({ default: m.ChineseRemainderTheoremPage })),
  ),
  'rsa-cryptography': lazy(() =>
    import('@/pages/topics/RsaCryptographyPage').then((m) => ({ default: m.RsaCryptographyPage })),
  ),
};
