import { PlaceholderBlock } from '@/components/ui/PlaceholderBlock';
import type { SectionProps } from './section.types';
import styles from './Section.module.css';

export function QuizSection({ children }: SectionProps) {
  return (
    <section id="quiz" className={styles.section}>
      <h2 className={styles.heading}>แบบทดสอบ</h2>
      <div className={styles.body}>
        {children ?? <PlaceholderBlock widgetName="QuizCard" note="2-3 ข้อพร้อม instant feedback — เพิ่มใน Phase 2" />}
      </div>
    </section>
  );
}
