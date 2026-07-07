import { Outlet, useLocation } from 'react-router-dom';
import { getTopicByPath } from '@/data/topics';
import { Header } from './Header';
import { ProgressBar } from './ProgressBar';
import { PrevNextFooter } from './PrevNextFooter';
import styles from './TopicLayout.module.css';

export function TopicLayout() {
  const location = useLocation();
  const topic = getTopicByPath(location.pathname);

  if (!topic) {
    return (
      <>
        <Header />
        <main className="container">
          <p>ไม่พบหัวข้อนี้</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <ProgressBar currentTopicId={topic.id} />
      <div className={styles.content}>
        <Outlet />
        <PrevNextFooter currentTopicId={topic.id} />
      </div>
    </>
  );
}
