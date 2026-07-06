import type { BarCompareProps } from './BarCompare.types';
import styles from './BarCompare.module.css';

export function BarCompare({ labelA, valueA, labelB, valueB, maxValue }: BarCompareProps) {
  const max = maxValue ?? Math.max(valueA, valueB, 1);

  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <span className={styles.rowLabel}>{labelA}</span>
        <div className={styles.track}>
          <div className={styles.fillA} style={{ width: `${(valueA / max) * 100}%` }} />
        </div>
        <span className={styles.value}>{valueA}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.rowLabel}>{labelB}</span>
        <div className={styles.track}>
          <div className={styles.fillB} style={{ width: `${(valueB / max) * 100}%` }} />
        </div>
        <span className={styles.value}>{valueB}</span>
      </div>
    </div>
  );
}
