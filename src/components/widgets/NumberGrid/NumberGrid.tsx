import type { NumberGridProps } from './NumberGrid.types';
import styles from './NumberGrid.module.css';

export function NumberGrid({ max, start = 1, cellStates, cellDecor, onCellClick, disabled, compact }: NumberGridProps) {
  const values = Array.from({ length: Math.max(max - start + 1, 0) }, (_, i) => start + i);

  return (
    <div className={compact ? `${styles.grid} ${styles.gridCompact}` : styles.grid} role="grid">
      {values.map((n) => {
        const state = cellStates?.[n] ?? 'default';
        const decor = cellDecor?.[n];
        return (
          <button
            key={n}
            type="button"
            className={`${styles.cell} ${styles[state]}`}
            style={decor?.delayIndex !== undefined ? ({ '--cell-index': decor.delayIndex } as React.CSSProperties) : undefined}
            onClick={() => onCellClick?.(n)}
            disabled={disabled}
            title={decor?.title}
          >
            {n}
            {decor?.annotationColor && <span className={styles.annotation} style={{ background: decor.annotationColor }} />}
          </button>
        );
      })}
    </div>
  );
}
