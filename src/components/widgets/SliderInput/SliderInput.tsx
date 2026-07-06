import type { SliderInputProps } from './SliderInput.types';
import styles from './SliderInput.module.css';

export function SliderInput({ label, min, max, step = 1, value, onChange, disabled }: SliderInputProps) {
  return (
    <label className={styles.wrapper}>
      <span className={styles.label}>{label}</span>
      <div className={styles.controls}>
        <input
          type="range"
          className={styles.range}
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <input
          type="number"
          className={styles.number}
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </label>
  );
}
