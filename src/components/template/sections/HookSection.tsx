import { PlaceholderBlock } from '@/components/ui/PlaceholderBlock';
import type { SectionProps } from './section.types';
import styles from './Section.module.css';

export function HookSection({ children }: SectionProps) {
  return (
    <section id="hook" className={styles.section}>
      <h2 className={styles.heading}>จุดเริ่มต้น</h2>
      <div className={styles.body}>
        {children ?? <PlaceholderBlock widgetName="Hook" note="คำถามกวนใจก่อนเริ่มอธิบาย — เพิ่มเนื้อหาใน Phase 2" />}
      </div>
    </section>
  );
}
