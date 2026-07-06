import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>404 — ไม่พบหน้านี้</h1>
      <Link to="/" className={styles.link}>
        ← กลับไปหน้าแรก
      </Link>
    </div>
  );
}
