import type { ComponentType } from 'react';
import { DivisibilityPage } from '@/pages/topics/DivisibilityPage';
import { PrimesPage } from '@/pages/topics/PrimesPage';
import { SieveOfEratosthenesPage } from '@/pages/topics/SieveOfEratosthenesPage';
import { GcdEuclideanPage } from '@/pages/topics/GcdEuclideanPage';
import { LcmPage } from '@/pages/topics/LcmPage';
import { PrimeFactorizationPage } from '@/pages/topics/PrimeFactorizationPage';
import { ModularArithmeticPage } from '@/pages/topics/ModularArithmeticPage';
import { CongruencePage } from '@/pages/topics/CongruencePage';
import { FastModularExponentiationPage } from '@/pages/topics/FastModularExponentiationPage';
import { EulerTotientPage } from '@/pages/topics/EulerTotientPage';
import { FermatsLittleTheoremPage } from '@/pages/topics/FermatsLittleTheoremPage';
import { ExtendedEuclideanPage } from '@/pages/topics/ExtendedEuclideanPage';
import { ChineseRemainderTheoremPage } from '@/pages/topics/ChineseRemainderTheoremPage';
import { RsaCryptographyPage } from '@/pages/topics/RsaCryptographyPage';

/** Maps each TOPIC_ORDER id (src/data/topics.ts) to its page component. */
export const TOPIC_PAGE_COMPONENTS: Record<string, ComponentType> = {
  divisibility: DivisibilityPage,
  primes: PrimesPage,
  'sieve-of-eratosthenes': SieveOfEratosthenesPage,
  'gcd-euclidean': GcdEuclideanPage,
  lcm: LcmPage,
  'prime-factorization': PrimeFactorizationPage,
  'modular-arithmetic': ModularArithmeticPage,
  congruence: CongruencePage,
  'fast-modular-exponentiation': FastModularExponentiationPage,
  'euler-totient': EulerTotientPage,
  'fermats-little-theorem': FermatsLittleTheoremPage,
  'extended-euclidean': ExtendedEuclideanPage,
  'chinese-remainder-theorem': ChineseRemainderTheoremPage,
  'rsa-cryptography': RsaCryptographyPage,
};
