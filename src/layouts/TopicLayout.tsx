import { Outlet, useLocation } from 'react-router-dom';
import { getTopicByPath } from '@/data/topics';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { Header } from './Header';
import { ProgressBar } from './ProgressBar';
import { SectionSidebar } from './SectionSidebar';
import { SectionBottomSheet } from './SectionBottomSheet';
import { PrevNextFooter } from './PrevNextFooter';
import styles from './TopicLayout.module.css';

export function TopicLayout() {
  const location = useLocation();
  const isMobile = useIsMobile();
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
      <div className={styles.body}>
        {!isMobile && <SectionSidebar />}
        <div className={styles.content}>
          <Outlet />
          <PrevNextFooter currentTopicId={topic.id} />
        </div>
      </div>
      {isMobile && <SectionBottomSheet />}
    </>
  );
}
