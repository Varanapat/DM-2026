import { PlaceholderBlock } from '@/components/ui/PlaceholderBlock';
import type { SectionProps } from './section.types';
import styles from './Section.module.css';

export function StepWalkthroughSection({ children }: SectionProps) {
  return (
    <section id="walkthrough" className={styles.section}>
      <h2 className={styles.heading}>ทีละขั้นตอน</h2>
      <div className={styles.body}>
        {children ?? (
          <div className={styles.widgetList}>
            <PlaceholderBlock widgetName="StepController" />
            <PlaceholderBlock widgetName="CodeSyncPanel" />
          </div>
        )}
      </div>
    </section>
  );
}
