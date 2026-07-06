import { useNavigate } from 'react-router-dom';
import { TOPIC_ORDER } from '@/data/topics';
import { useProgress } from '@/hooks/useProgress';
import { CourseMapGraph } from '@/components/widgets/CourseMapGraph';
import styles from './LandingPage.module.css';

export function LandingPage() {
  const navigate = useNavigate();
  const { completed, percentComplete } = useProgress();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.title}>Discrete Math</h1>
          <p className={styles.unit}>Number Theory</p>
          <p className={styles.tagline}>
            แผนที่การเรียนรู้แบบ interactive — เลือกหัวข้อจาก roadmap ด้านล่าง เรียนรู้ผ่านการเล่นและลงมือทำ ไม่ใช่แค่อ่านทฤษฎีบท
          </p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{completed.size}</div>
            <div className={styles.statLabel}>/ {TOPIC_ORDER.length} หัวข้อ</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{percentComplete}%</div>
            <div className={styles.statLabel}>ความคืบหน้า</div>
          </div>
        </div>
      </section>

      <section className={styles.roadmapSection}>
        <h2 className={styles.roadmapHeading}>Number Theory Roadmap</h2>
        <p className={styles.roadmapHint}>คลิกที่หัวข้อเพื่อเริ่มเรียน — เส้นเชื่อมแสดงว่าต้องเรียนหัวข้อไหนมาก่อน</p>
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
