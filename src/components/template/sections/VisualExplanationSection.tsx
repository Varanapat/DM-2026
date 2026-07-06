import { PlaceholderBlock } from '@/components/ui/PlaceholderBlock';
import { TOPIC_CONTENT } from '@/data/topicContent';
import type { SectionProps } from './section.types';
import styles from './Section.module.css';

export function VisualExplanationSection({ topicId, children }: SectionProps) {
  const content = TOPIC_CONTENT[topicId];

  return (
    <section id="visual-explanation" className={styles.section}>
      <h2 className={styles.heading}>ภาพอธิบาย</h2>
      <div className={styles.body}>
        {content && <p>{content.coreConceptTh}</p>}
        {children ?? (
          <div className={styles.widgetList}>
            {(content?.primaryWidgets ?? ['VisualExplanation']).map((widgetName) => (
              <PlaceholderBlock key={widgetName} widgetName={widgetName} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
