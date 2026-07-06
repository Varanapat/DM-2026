import { Card } from '@/components/ui/Card';
import { Badge, type BadgeVariant } from '@/components/ui/Badge';
import { EXERCISES, type ExerciseDifficulty } from '@/data/exercises';
import type { SectionProps } from './section.types';
import styles from './Section.module.css';
import exerciseStyles from './PracticeChallengeSection.module.css';

const DIFFICULTY_META: Record<ExerciseDifficulty, { labelTh: string; variant: BadgeVariant }> = {
  easy: { labelTh: 'ง่าย', variant: 'success' },
  medium: { labelTh: 'ปานกลาง', variant: 'accent' },
  hard: { labelTh: 'ยาก', variant: 'secondary' },
  'open-ended': { labelTh: '💡 โจทย์เปิดกว้าง', variant: 'default' },
};

export function PracticeChallengeSection({ topicId, children }: SectionProps) {
  const exercises = EXERCISES[topicId] ?? [];

  return (
    <section id="practice" className={styles.section}>
      <h2 className={styles.heading}>โจทย์ฝึกฝน</h2>
      <div className={styles.body}>
        {children ?? (
          <div className={exerciseStyles.list}>
            {exercises.length === 0 && <Card>ยังไม่มีโจทย์สำหรับหัวข้อนี้</Card>}
            {exercises.map((exercise) => {
              const meta = DIFFICULTY_META[exercise.difficulty];
              return (
                <Card key={exercise.id} className={exerciseStyles.item}>
                  <Badge variant={meta.variant}>{meta.labelTh}</Badge>
                  <p>{exercise.promptTh}</p>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
