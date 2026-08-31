import type { ReactNode } from 'react';
import type { DefinitionCardProps, DefinitionStatementProps } from './DefinitionCard.types';
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
      <div className={styles.defNote}>{note}</div>
    </section>
  );
}

/** The formal "ให้ … / เรากล่าวว่า … ก็ต่อเมื่อ … / <equation> / หรือกล่าวได้ว่า …" wording
 * every topic states below its formula. */
export function DefinitionStatement({ given, claim, equation, restate }: DefinitionStatementProps) {
  return (
    <div className={styles.statement}>
      <p className={styles.statementGiven}>{given}</p>
      <p className={styles.statementClaim}>{claim}</p>
      {equation && <p className={styles.statementEquation}>{equation}</p>}
      {restate && <p className={styles.statementRestate}>{restate}</p>}
    </div>
  );
}

/** Shared vertical rhythm (space-6 gap) between the definition card and whatever
 * interactive content follows it — matches the Divisibility page pattern. */
export function TopicPageStack({ children }: { children: ReactNode }) {
  return <div className={styles.stack}>{children}</div>;
}
