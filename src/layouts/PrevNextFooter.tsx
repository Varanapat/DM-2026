import { Link } from 'react-router-dom';
import { getPrevNext } from '@/utils/topicNav';
import styles from './PrevNextFooter.module.css';

export function PrevNextFooter({ currentTopicId }: { currentTopicId: string }) {
  const { prev, next } = getPrevNext(currentTopicId);

  return (
    <footer className={styles.footer}>
      {prev ? (
        <Link to={prev.path} className={styles.link}>
          <span className={styles.direction}>← หัวข้อก่อนหน้า</span>
          <span className={styles.title}>{prev.titleTh}</span>
        </Link>
      ) : (
        <span className={styles.spacer} />
      )}
      {next ? (
        <Link to={next.path} className={`${styles.link} ${styles.next}`}>
          <span className={styles.direction}>หัวข้อถัดไป →</span>
          <span className={styles.title}>{next.titleTh}</span>
        </Link>
      ) : (
        <span className={styles.spacer} />
      )}
    </footer>
  );
}
