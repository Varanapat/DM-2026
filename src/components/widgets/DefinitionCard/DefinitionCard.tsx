import type { ReactNode } from 'react';
import type { DefinitionCardProps } from './DefinitionCard.types';
import styles from './DefinitionCard.module.css';

export function DefinitionCard({ title = 'นิยาม', definition, formulaLabel = 'สูตร', formula, note }: DefinitionCardProps) {
  return (
    <section className={styles.card}>
      <p className={styles.cardTitle}>
        <span className={styles.cardTitleDot} aria-hidden="true" />
        {title}
      </p>
      {definition && <p className={styles.definitionText}>{definition}</p>}
      {definition && <p className={styles.subLabel}>{formulaLabel}</p>}
      <div className={styles.formula}>{formula}</div>
      <p className={styles.defNote}>{note}</p>
    </section>
  );
}

/** Shared vertical rhythm (space-6 gap) between the definition card and whatever
 * interactive content follows it — matches the Divisibility page pattern. */
export function TopicPageStack({ children }: { children: ReactNode }) {
  return <div className={styles.stack}>{children}</div>;
}
