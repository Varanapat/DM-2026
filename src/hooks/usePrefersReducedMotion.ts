import { useMediaQuery } from './useMediaQuery';

/**
 * Widgets with GSAP/D3 animation (Phase 2) should branch on this to skip or
 * shorten animation, not just rely on CSS transition-duration tokens.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
