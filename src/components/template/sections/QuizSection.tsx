import { TopicQuiz } from '@/components/widgets/TopicQuiz';
import type { SectionProps } from './section.types';
import styles from './Section.module.css';

export function QuizSection({ topicId, children }: SectionProps) {
  return (
    <section id="quiz" className={styles.section}>
      <h2 className={styles.heading}>แบบทดสอบ</h2>
      <div className={styles.body}>{children ?? <TopicQuiz topicId={topicId} />}</div>
    </section>
  );
}
