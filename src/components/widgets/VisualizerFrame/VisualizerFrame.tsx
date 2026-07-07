import type { VisualizerFrameProps } from './VisualizerFrame.types';
import styles from './VisualizerFrame.module.css';

export function VisualizerFrame({ title, headerExtra, monitor, footer, children }: VisualizerFrameProps) {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {headerExtra}
      </div>

      {monitor ? (
        <div className={styles.layout}>
          <div className={styles.canvasArea}>{children}</div>
          {monitor}
        </div>
      ) : (
        <div className={styles.canvasArea}>{children}</div>
      )}

      {footer && (
        <div className={styles.footer}>
          <div className={styles.footerInner}>{footer}</div>
        </div>
      )}
    </div>
  );
}
