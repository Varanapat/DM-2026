import { gcd } from '@/utils/algorithms/euclidean';
import { TopicPageTemplate } from '@/components/template/TopicPageTemplate';
import { RibbonSegments } from '@/components/widgets/RibbonSegments';
import { PredictReveal } from '@/components/widgets/PredictReveal';
import { GcdVisualizer } from './GcdVisualizer';
import styles from './GcdEuclideanPage.module.css';

// fixed puzzle numbers for the Hook — independent of the interactive visualizer below
const HOOK_A = 18;
const HOOK_B = 24;

export function GcdEuclideanPage() {
  const hookGcd = gcd(HOOK_A, HOOK_B);
  const maxHookBar = Math.max(HOOK_A, HOOK_B);

  return (
    <TopicPageTemplate
      topicId="gcd-euclidean"
      hook={
        <div className={styles.hook}>
          <p>
            ริบบิ้น {HOOK_A} ซม. กับ {HOOK_B} ซม. — อยากตัดเป็นท่อนเท่ากันที่ <strong>ยาวที่สุด</strong> โดยไม่เหลือเศษ ท่อนละกี่ ซม.?
          </p>
          <div className={styles.plainBars}>
            <div>
              <div className={styles.plainBarLabel}>{HOOK_A} ซม.</div>
              <div className={styles.plainBarTrack} style={{ width: `${(HOOK_A / maxHookBar) * 100}%` }} />
            </div>
            <div>
              <div className={styles.plainBarLabel}>{HOOK_B} ซม.</div>
              <div className={`${styles.plainBarTrack} ${styles.plainBarTrackAlt}`} style={{ width: `${(HOOK_B / maxHookBar) * 100}%` }} />
            </div>
          </div>
          <PredictReveal question="ท่อนที่ยาวที่สุดที่ตัดได้พอดี ยาวกี่ ซม.?">
            <p>
              <strong>{hookGcd} ซม.</strong> — ได้ {HOOK_A / hookGcd} ท่อน และ {HOOK_B / hookGcd} ท่อน พอดีไม่เหลือเศษ
            </p>
            <RibbonSegments
              bars={[
                { label: `${HOOK_A} ซม.`, length: HOOK_A },
                { label: `${HOOK_B} ซม.`, length: HOOK_B },
              ]}
              unit={hookGcd}
            />
            <p className={styles.hookSub}>{hookGcd} คือ GCD (ตัวหารร่วมมาก) — หน่วยวัดใหญ่ที่สุดที่หารทั้งคู่ลงตัว</p>
          </PredictReveal>
        </div>
      }
      visual={<GcdVisualizer />}
    />
  );
}
