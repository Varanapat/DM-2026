import type { ExecutionMonitorProps } from './ExecutionMonitor.types';
import styles from './ExecutionMonitor.module.css';

export function ExecutionMonitor({ title = 'Execution Monitor', hint, lines, badge }: ExecutionMonitorProps) {
  return (
    <aside className={styles.panel}>
      <p className={styles.title}>{title}</p>

      {lines.length === 0 && hint && <p className={styles.hint}>{hint}</p>}

      {lines.length > 0 && (
        <div className={styles.log}>
          {lines.map((line, i) => (
            <div key={i} className={styles.logRow}>
              {line.swatchColor && <span className={styles.swatch} style={{ background: line.swatchColor }} />}
              <span className={line.emphasis ? `${styles.logText} ${styles.logTextEmphasis}` : styles.logText}>{line.text}</span>
            </div>
          ))}
        </div>
      )}

      {badge && <span className={styles.badge}>{badge}</span>}
    </aside>
  );
}
