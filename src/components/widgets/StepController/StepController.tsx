import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { StepControllerProps } from './StepController.types';
import styles from './StepController.module.css';

export function StepController({
  totalSteps,
  currentStep,
  mode,
  speed: initialSpeed = 1,
  onStepChange,
  onModeChange,
  disabled,
}: StepControllerProps) {
  const [speed, setSpeed] = useState(initialSpeed);
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
    }, 1200 / speed);
    return () => clearTimeout(timer);
  }, [mode, currentStep, speed, atEnd, disabled, prefersReducedMotion, totalSteps, onStepChange, onModeChange]);

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.button}
        onClick={() => {
          onStepChange(0);
          onModeChange?.('manual');
        }}
        disabled={disabled || atStart}
        aria-label="Reset"
      >
        ⏮
      </button>
      <button
        type="button"
        className={styles.button}
        onClick={() => {
          onStepChange(Math.max(currentStep - 1, 0));
          onModeChange?.('manual');
        }}
        disabled={disabled || atStart}
        aria-label="Previous step"
      >
        ◀
      </button>
      <button
        type="button"
        className={styles.button}
        onClick={() => onModeChange?.(mode === 'auto' ? 'manual' : 'auto')}
        disabled={disabled || (atEnd && mode !== 'auto')}
        aria-label={mode === 'auto' ? 'Pause' : 'Play'}
      >
        {mode === 'auto' ? '⏸' : '▶'}
      </button>
      <button
        type="button"
        className={styles.button}
        onClick={() => {
          onStepChange(Math.min(currentStep + 1, totalSteps - 1));
          onModeChange?.('manual');
        }}
        disabled={disabled || atEnd}
        aria-label="Next step"
      >
        ⏭
      </button>
      <span className={styles.step}>
        Step {currentStep + 1}/{totalSteps}
      </span>
      <label className={styles.speed}>
        Speed
        <input
          type="range"
          min={0.5}
          max={3}
          step={0.5}
          value={speed}
          disabled={disabled}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
      </label>
    </div>
  );
}
