import { Link, Outlet, useLocation } from 'react-router-dom';
import { getTopicByPath } from '@/data/topics';
import { PrevNextFooter } from './PrevNextFooter';
import { TopicSidebar } from './TopicSidebar';
import styles from './TopicLayout.module.css';

export function TopicLayout() {
  const location = useLocation();
  const topic = getTopicByPath(location.pathname);

  if (!topic) {
    return (
      <main className={styles.notFound}>
        <p>ไม่พบหัวข้อนี้</p>
        <Link to="/">← กลับหน้าแรก</Link>
      </main>
    );
  }

  return (
    <div className={styles.shell}>
      <TopicSidebar currentTopicId={topic.id} />
      <div className={styles.content}>
        <Outlet />
        <PrevNextFooter currentTopicId={topic.id} />
      </div>
    </div>
  );
}
