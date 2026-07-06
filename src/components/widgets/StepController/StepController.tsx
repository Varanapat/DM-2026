import type { StepControllerProps } from './StepController.types';
import styles from './StepController.module.css';

export function StepController({
  totalSteps,
  currentStep,
  mode,
  speed = 1,
  onStepChange,
  onModeChange,
  disabled,
}: StepControllerProps) {
  const atStart = currentStep <= 0;
  const atEnd = currentStep >= totalSteps - 1;

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.button}
        onClick={() => onStepChange(0)}
        disabled={disabled || atStart}
        aria-label="Reset"
      >
        ⏮
      </button>
      <button
        type="button"
        className={styles.button}
        onClick={() => onModeChange?.(mode === 'auto' ? 'manual' : 'auto')}
        disabled={disabled}
        aria-label={mode === 'auto' ? 'Pause' : 'Play'}
      >
        {mode === 'auto' ? '⏸' : '▶'}
      </button>
      <button
        type="button"
        className={styles.button}
        onClick={() => onStepChange(Math.min(currentStep + 1, totalSteps - 1))}
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
        <input type="range" min={0.5} max={3} step={0.5} value={speed} disabled readOnly />
      </label>
    </div>
  );
}
