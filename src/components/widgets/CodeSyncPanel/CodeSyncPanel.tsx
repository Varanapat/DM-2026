import type { CodeSyncPanelProps } from './CodeSyncPanel.types';
import styles from './CodeSyncPanel.module.css';

export function CodeSyncPanel({ lines, activeLine }: CodeSyncPanelProps) {
  return (
    <pre className={styles.panel}>
      {lines.map((line, index) => (
        <div key={index} className={`${styles.line} ${index === activeLine ? styles.active : ''}`}>
          {line}
        </div>
      ))}
    </pre>
  );
}
