import { PlaceholderBlock } from '@/components/ui/PlaceholderBlock';
import { TOPIC_CONTENT } from '@/data/topicContent';
import type { SectionProps } from './section.types';
import styles from './Section.module.css';

export function VisualExplanationSection({ topicId, children, hideIntro }: SectionProps) {
  const content = TOPIC_CONTENT[topicId];

  return (
    <section id="visual-explanation" className={styles.section}>
      {!hideIntro && <h2 className={styles.heading}>นิยาม</h2>}
      <div className={styles.body}>
        {!hideIntro && content && <p>{content.coreConceptTh}</p>}
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
