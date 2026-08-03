import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { TOPIC_ORDER } from '@/data/topics';
import { useProgress } from '@/hooks/useProgress';
import { useTheme } from '@/hooks/useTheme';
import styles from './TopicSidebar.module.css';

export function TopicSidebar({ currentTopicId }: { currentTopicId: string }) {
  const { completed, percentComplete, isComplete, toggleComplete } = useProgress();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const done = isComplete(currentTopicId);
  const close = () => setOpen(false);

  return (
    <aside className={open ? `${styles.rail} ${styles.railOpen}` : styles.rail}>
      <div className={styles.brandRow}>
        <Link to="/" className={styles.brand} onClick={close}>
          <span className={styles.brandMark} aria-hidden="true">
            DM
          </span>
          <span className={styles.brandWord}>Number Theory</span>
        </Link>
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="สลับรายการหัวข้อ"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      <nav className={styles.nav} aria-label="รายการหัวข้อทั้งหมด">
        <ol className={styles.list}>
          {TOPIC_ORDER.map((topic, index) => (
            <li key={topic.id}>
              <NavLink
                to={topic.path}
                onClick={close}
                className={topic.id === currentTopicId ? `${styles.link} ${styles.linkActive}` : styles.link}
                aria-current={topic.id === currentTopicId ? 'page' : undefined}
              >
                <span className={isComplete(topic.id) ? `${styles.linkIndex} ${styles.linkIndexDone}` : styles.linkIndex}>
                  {isComplete(topic.id) ? '✓' : String(index + 1).padStart(2, '0')}
                </span>
                <span className={styles.linkLabel}>{topic.titleTh}</span>
              </NavLink>
            </li>
          ))}
        </ol>
      </nav>

      <div className={styles.utility}>
        <div className={styles.progressRow}>
          <span className={styles.progressText}>
            {completed.size}/{TOPIC_ORDER.length} หัวข้อ · {percentComplete}%
          </span>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${percentComplete}%` }} />
          </div>
        </div>
        <button
          type="button"
          className={done ? `${styles.markBtn} ${styles.markBtnDone}` : styles.markBtn}
          onClick={() => toggleComplete(currentTopicId)}
        >
          {done ? '✓ เรียนหัวข้อนี้แล้ว' : 'ทำเครื่องหมายว่าเรียนแล้ว'}
        </button>
        <div className={styles.utilityLinks}>
          <Link to="/playground" className={styles.utilityLink} onClick={close}>
            Playground
          </Link>
          <Link to="/glossary" className={styles.utilityLink} onClick={close}>
            Glossary
          </Link>
          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </aside>
  );
}
