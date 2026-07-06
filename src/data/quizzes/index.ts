import type { QuizQuestion } from '@/components/widgets/QuizCard';
import divisibility from './divisibility.json';
import primes from './primes.json';
import sieveOfEratosthenes from './sieve-of-eratosthenes.json';
import gcdEuclidean from './gcd-euclidean.json';
import lcm from './lcm.json';
import primeFactorization from './prime-factorization.json';
import modularArithmetic from './modular-arithmetic.json';
import congruence from './congruence.json';
import fastModularExponentiation from './fast-modular-exponentiation.json';
import eulerTotient from './euler-totient.json';
import fermatsLittleTheorem from './fermats-little-theorem.json';
import extendedEuclidean from './extended-euclidean.json';
import chineseRemainderTheorem from './chinese-remainder-theorem.json';
import rsaCryptography from './rsa-cryptography.json';

export const QUIZZES: Record<string, QuizQuestion[]> = {
  divisibility,
  primes,
  'sieve-of-eratosthenes': sieveOfEratosthenes,
  'gcd-euclidean': gcdEuclidean,
  lcm,
  'prime-factorization': primeFactorization,
  'modular-arithmetic': modularArithmetic,
  congruence,
  'fast-modular-exponentiation': fastModularExponentiation,
  'euler-totient': eulerTotient,
  'fermats-little-theorem': fermatsLittleTheorem,
  'extended-euclidean': extendedEuclidean,
  'chinese-remainder-theorem': chineseRemainderTheorem,
  'rsa-cryptography': rsaCryptography,
};
