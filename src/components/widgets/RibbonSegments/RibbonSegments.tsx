import type { RibbonSegmentsProps } from './RibbonSegments.types';
import styles from './RibbonSegments.module.css';

const MAX_RENDERED_SEGMENTS = 24;

/** Visualizes lengths as bars divided into equal-size ticks — the intuition
 * for "gcd is the biggest measuring stick that fits both lengths evenly". */
export function RibbonSegments({ bars, unit, unitLabel = 'หน่วย' }: RibbonSegmentsProps) {
  const maxLength = Math.max(...bars.map((bar) => bar.length), 1);

  return (
    <div className={styles.wrapper}>
      {bars.map((bar, barIndex) => {
        const segmentCount = unit > 0 ? Math.round(bar.length / unit) : 0;
        const widthPercent = (bar.length / maxLength) * 100;
        const showIndividualSegments = segmentCount > 0 && segmentCount <= MAX_RENDERED_SEGMENTS;

        return (
          <div key={bar.label} className={styles.row}>
            <span className={styles.label}>{bar.label}</span>
            <div style={{ width: `${widthPercent}%` }}>
              {showIndividualSegments ? (
                <div className={styles.track}>
                  {Array.from({ length: segmentCount }, (_, i) => (
                    <div key={i} className={barIndex % 2 === 0 ? styles.segment : `${styles.segment} ${styles.segmentAlt}`} />
                  ))}
                </div>
              ) : (
                <div className={styles.fineTrack} style={{ '--seg-count': segmentCount } as React.CSSProperties} />
              )}
            </div>
            <span className={styles.count}>
              {segmentCount} × {unit}
            </span>
          </div>
        );
      })}
      <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>
        แต่ละแท่งตัดเป็นชิ้นยาว {unit} {unitLabel} เท่า ๆ กัน ได้พอดีไม่มีเศษเหลือ
      </p>
    </div>
  );
}
