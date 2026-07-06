import { TOPIC_ORDER } from '@/data/topics';
import { useProgress } from '@/hooks/useProgress';
import styles from './ProgressBar.module.css';

export function ProgressBar({ currentTopicId }: { currentTopicId: string }) {
  const { percentComplete, isComplete, toggleComplete, completed } = useProgress();
  const done = isComplete(currentTopicId);

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>
        {completed.size}/{TOPIC_ORDER.length} หัวข้อ
      </span>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={percentComplete}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="ความคืบหน้าโดยรวม"
      >
        <div className={styles.fill} style={{ width: `${percentComplete}%` }} />
      </div>
      <button
        type="button"
        className={done ? `${styles.markButton} ${styles.markButtonDone}` : styles.markButton}
        onClick={() => toggleComplete(currentTopicId)}
      >
        {done ? '✓ เรียนแล้ว' : 'ทำเครื่องหมายว่าเรียนแล้ว'}
      </button>
    </div>
  );
}
