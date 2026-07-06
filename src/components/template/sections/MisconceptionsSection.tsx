import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TOPIC_CONTENT } from '@/data/topicContent';
import type { SectionProps } from './section.types';
import styles from './Section.module.css';

export function MisconceptionsSection({ topicId, children }: SectionProps) {
  const content = TOPIC_CONTENT[topicId];

  return (
    <section id="misconceptions" className={styles.section}>
      <h2 className={styles.heading}>เข้าใจผิดบ่อย</h2>
      <div className={styles.body}>
        {children ?? (
          <Card>
            <Badge variant="danger">ผิดบ่อย</Badge>
            <p>{content?.misconceptionTh ?? 'ยังไม่มีข้อมูลสำหรับหัวข้อนี้'}</p>
          </Card>
        )}
      </div>
    </section>
  );
}
