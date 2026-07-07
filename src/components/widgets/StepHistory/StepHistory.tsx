import type { StepHistoryProps } from './StepHistory.types';
import styles from './StepHistory.module.css';

/** Growing log of completed steps (not just the current one) — for comparing
 * two step-by-step processes side by side. The latest entry is emphasized,
 * older ones stay visible but muted. */
export function StepHistory({ title, entries, emptyHint = 'กดเริ่มเพื่อดูขั้นตอน', accent = 'accent' }: StepHistoryProps) {
  return (
    <div className={styles.panel}>
      <h3 className={accent === 'secondary' ? `${styles.title} ${styles.titleSecondary}` : styles.title}>{title}</h3>
      <div className={styles.list}>
        {entries.length === 0 && <p className={styles.empty}>{emptyHint}</p>}
        {entries.map((entry, index) => (
          <div key={index} className={index === entries.length - 1 ? `${styles.entry} ${styles.entryLatest}` : styles.entry}>
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
}
