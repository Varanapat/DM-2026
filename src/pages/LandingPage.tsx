import { useNavigate } from 'react-router-dom';
import { TOPIC_ORDER } from '@/data/topics';
import { useProgress } from '@/hooks/useProgress';
import { CourseMapGraph } from '@/components/widgets/CourseMapGraph';
import styles from './LandingPage.module.css';

export function LandingPage() {
  const navigate = useNavigate();
  const { completed } = useProgress();

  return (
    <div>
      <section className={styles.hero}>
        <h1 className={styles.title}>Interactive Number Theory Learning Guide</h1>
        <p className={styles.subtitle}>เรียนรู้ Number Theory ผ่านการเล่นและลงมือทำ ไม่ใช่แค่อ่านทฤษฎีบท</p>
      </section>
      <section className={styles.mapSection}>
        <h2 className={styles.mapHeading}>Course Map</h2>
        <CourseMapGraph
          topics={TOPIC_ORDER}
          completedIds={completed}
          onNodeClick={(id) => {
            const topic = TOPIC_ORDER.find((t) => t.id === id);
            if (topic) navigate(topic.path);
          }}
        />
      </section>
    </div>
  );
}
