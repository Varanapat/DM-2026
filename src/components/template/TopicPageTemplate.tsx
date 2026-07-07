import type { ReactNode } from 'react';
import { getTopicById } from '@/data/topics';
import { VisualExplanationSection } from './sections/VisualExplanationSection';
import styles from './TopicPageTemplate.module.css';

export interface TopicPageTemplateProps {
  topicId: string;
  /** The single content slot — the concept AND the step-by-step algorithm as
   * one merged animation timeline; omit to fall back to a Phase-2 placeholder. */
  visual?: ReactNode;
}

export function TopicPageTemplate({ topicId, visual }: TopicPageTemplateProps) {
  const topic = getTopicById(topicId);

  return (
    <article>
      <header className={styles.header}>
        <h1 className={styles.title}>{topic?.titleTh ?? topicId}</h1>
        {topic && <p className={styles.objective}>{topic.objectiveTh}</p>}
      </header>

      <VisualExplanationSection topicId={topicId}>{visual}</VisualExplanationSection>
    </article>
  );
}
