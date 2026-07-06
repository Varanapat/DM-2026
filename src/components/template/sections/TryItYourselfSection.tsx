import { PlaceholderBlock } from '@/components/ui/PlaceholderBlock';
import type { SectionProps } from './section.types';
import styles from './Section.module.css';

export function TryItYourselfSection({ children }: SectionProps) {
  return (
    <section id="try-it" className={styles.section}>
      <h2 className={styles.heading}>ลองเอง</h2>
      <div className={styles.body}>
        {children ?? <PlaceholderBlock widgetName="SliderInput" note="sandbox ให้ใส่ค่าเอง — เพิ่ม widget ใน Phase 2" />}
      </div>
    </section>
  );
}
