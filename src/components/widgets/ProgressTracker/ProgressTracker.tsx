import { useProgress } from '@/hooks/useProgress';
import styles from './ProgressTracker.module.css';

export function ProgressTracker() {
  const { percentComplete } = useProgress();

  return (
    <div className={styles.wrapper}>
      <div className={styles.track} role="progressbar" aria-valuenow={percentComplete} aria-valuemin={0} aria-valuemax={100}>
        <div className={styles.fill} style={{ width: `${percentComplete}%` }} />
      </div>
      <span>{percentComplete}%</span>
    </div>
  );
}
