import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { BarCompareProps } from './BarCompare.types';
import styles from './BarCompare.module.css';

function useAnimatedWidth(percent: number, prefersReducedMotion: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion) {
      gsap.set(el, { width: `${percent}%` });
      return;
    }
    const tween = gsap.to(el, { width: `${percent}%`, duration: 0.5, ease: 'power2.out' });
    return () => {
      tween.kill();
    };
  }, [percent, prefersReducedMotion]);

  return ref;
}

export function BarCompare({ labelA, valueA, labelB, valueB, maxValue }: BarCompareProps) {
  const max = maxValue ?? Math.max(valueA, valueB, 1);
  const prefersReducedMotion = usePrefersReducedMotion();
  const fillARef = useAnimatedWidth((valueA / max) * 100, prefersReducedMotion);
  const fillBRef = useAnimatedWidth((valueB / max) * 100, prefersReducedMotion);

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <span className={styles.rowLabel}>{labelA}</span>
        <div className={styles.track}>
          <div ref={fillARef} className={styles.fillA} />
        </div>
        <span className={styles.value}>{valueA}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.rowLabel}>{labelB}</span>
        <div className={styles.track}>
          <div ref={fillBRef} className={styles.fillB} />
        </div>
        <span className={styles.value}>{valueB}</span>
      </div>
    </div>
  );
}
