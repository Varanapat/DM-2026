import type { NumberGridProps } from './NumberGrid.types';
import styles from './NumberGrid.module.css';

export function NumberGrid({ max, cellStates, onCellClick, disabled }: NumberGridProps) {
  const values = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className={styles.grid} role="grid">
      {values.map((n) => {
        const state = cellStates?.[n] ?? 'default';
        return (
          <button
            key={n}
            type="button"
            className={`${styles.cell} ${styles[state]}`}
            onClick={() => onCellClick?.(n)}
            disabled={disabled}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
