import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TOPIC_CONTENT } from '@/data/topicContent';
import type { SectionProps } from './section.types';
import styles from './Section.module.css';

export function PracticeChallengeSection({ topicId, children }: SectionProps) {
  const content = TOPIC_CONTENT[topicId];

  return (
    <section id="practice" className={styles.section}>
      <h2 className={styles.heading}>โจทย์ฝึกฝน</h2>
      <div className={styles.body}>
        {children ?? (
          <Card>
            <Badge variant="accent">ลองทำดู</Badge>
            <p>{content?.practiceChallengeTh ?? 'ยังไม่มีข้อมูลสำหรับหัวข้อนี้'}</p>
          </Card>
        )}
      </div>
    </section>
  );
}
