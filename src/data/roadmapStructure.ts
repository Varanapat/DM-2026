export interface RoadmapBranch {
  topicId: string;
  side: 'left' | 'right';
}

export interface RoadmapSpineNode {
  topicId: string;
  branches?: RoadmapBranch[];
}

/**
 * Curated single-spine roadmap layout (roadmap.sh style): one straight vertical
 * path down the center, with closely-related topics hanging off as short
 * horizontal branches. This is intentionally simpler than the full dependency
 * DAG in data/topics.ts — a branch only shows a connector to the ONE spine
 * node it's most directly tied to, not every prerequisite it actually has.
 * Real prerequisite gating (locked/available/completed) still uses the full
 * dependsOn graph; this structure only controls what gets drawn.
 *
 * Ordering rule: every topic's real dependsOn (from topics.ts) must already
 * appear earlier in this list (as a spine node or a branch) before it's used
 * here, so reading top-to-bottom never shows a topic before its prerequisites.
 *
 * To add a new topic later: add it to data/topics.ts first, then place it
 * here either as a new spine row (continuing the main path) or as a branch
 * off the single spine row it depends on most directly.
 */
export const ROADMAP_STRUCTURE: RoadmapSpineNode[] = [
  { topicId: 'divisibility' },
  {
    topicId: 'primes',
    branches: [
      { topicId: 'sieve-of-eratosthenes', side: 'right' },
      { topicId: 'prime-factorization', side: 'left' },
    ],
  },
  {
    topicId: 'gcd-euclidean',
    branches: [
      { topicId: 'lcm', side: 'right' },
      { topicId: 'extended-euclidean', side: 'left' },
    ],
  },
  {
    topicId: 'modular-arithmetic',
    branches: [{ topicId: 'congruence', side: 'right' }],
  },
  { topicId: 'fast-modular-exponentiation' },
  { topicId: 'euler-totient' },
  { topicId: 'fermats-little-theorem' },
  { topicId: 'chinese-remainder-theorem' },
  { topicId: 'rsa-cryptography' },
];
