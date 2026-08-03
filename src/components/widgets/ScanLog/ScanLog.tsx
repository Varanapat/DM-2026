import { useEffect, useRef } from 'react';
import type { ScanLogProps } from './ScanLog.types';
import styles from './ScanLog.module.css';

/** Dark terminal-style scrolling log — shows the running history of check
 * operations (not just the current one), most recent line highlighted. */
export function ScanLog({ lines, title = 'Log', emptyHint = 'รอเริ่มสแกน…' }: ScanLogProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines.length]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>{title}</div>
      <div className={styles.panel} ref={panelRef}>
        {lines.length === 0 && <p className={styles.empty}>{emptyHint}</p>}
        {lines.map((line, index) => (
          <div key={index} className={index === lines.length - 1 ? `${styles.line} ${styles.lineLatest}` : styles.line}>
            <span className={styles.lineNumber}>{index + 1}</span>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
