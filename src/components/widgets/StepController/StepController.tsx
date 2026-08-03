import { useEffect } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { StepControllerProps } from './StepController.types';
import styles from './StepController.module.css';

const AUTOPLAY_INTERVAL_MS = 1200;

export function StepController({ totalSteps, currentStep, mode, onStepChange, onModeChange, disabled }: StepControllerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const atStart = currentStep <= 0;
  const atEnd = currentStep >= totalSteps - 1;

  useEffect(() => {
    if (mode !== 'auto' || disabled) return;

    if (atEnd) {
      onModeChange?.('manual');
      return;
    }

    if (prefersReducedMotion) {
      onStepChange(totalSteps - 1);
      onModeChange?.('manual');
      return;
    }

    const timer = setTimeout(() => {
      onStepChange(Math.min(currentStep + 1, totalSteps - 1));
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [mode, currentStep, atEnd, disabled, prefersReducedMotion, totalSteps, onStepChange, onModeChange]);

  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 100;

  return (
    <div className={styles.wrapper}>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => {
            onStepChange(Math.max(currentStep - 1, 0));
            onModeChange?.('manual');
          }}
          disabled={disabled || atStart}
          aria-label="Previous step"
        >
          ‹
        </button>
        <button
          type="button"
          className={styles.playBtn}
          onClick={() => onModeChange?.(mode === 'auto' ? 'manual' : 'auto')}
          disabled={disabled || (atEnd && mode !== 'auto')}
          aria-label={mode === 'auto' ? 'Pause' : 'Play'}
        >
          {mode === 'auto' ? '⏸' : '▶'}
        </button>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => {
            onStepChange(Math.min(currentStep + 1, totalSteps - 1));
            onModeChange?.('manual');
          }}
          disabled={disabled || atEnd}
          aria-label="Next step"
        >
          ›
        </button>
      </div>

      <div className={styles.progress}>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.stepText}>
          {currentStep + 1}/{totalSteps}
        </span>
      </div>
    </div>
  );
}
