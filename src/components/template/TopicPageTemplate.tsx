import type { ReactNode } from 'react';
import { getTopicById } from '@/data/topics';
import { HookSection } from './sections/HookSection';
import { VisualExplanationSection } from './sections/VisualExplanationSection';
import { TryItYourselfSection } from './sections/TryItYourselfSection';
import { StepWalkthroughSection } from './sections/StepWalkthroughSection';
import { MisconceptionsSection } from './sections/MisconceptionsSection';
import { QuizSection } from './sections/QuizSection';
import { PracticeChallengeSection } from './sections/PracticeChallengeSection';
import styles from './TopicPageTemplate.module.css';

export interface TopicPageTemplateProps {
  topicId: string;
  /** Section content slots — omit any slot to fall back to a Phase-2 placeholder. */
  hook?: ReactNode;
  visual?: ReactNode;
  tryIt?: ReactNode;
  walkthrough?: ReactNode;
  misconceptions?: ReactNode;
  quiz?: ReactNode;
  practice?: ReactNode;
}

export function TopicPageTemplate({
  topicId,
  hook,
  visual,
  tryIt,
  walkthrough,
  misconceptions,
  quiz,
  practice,
}: TopicPageTemplateProps) {
  const topic = getTopicById(topicId);

  return (
    <article>
      <header className={styles.header}>
        <h1 className={styles.title}>{topic?.titleTh ?? topicId}</h1>
        {topic && <p className={styles.objective}>{topic.objectiveTh}</p>}
      </header>

      <HookSection topicId={topicId}>{hook}</HookSection>
      <VisualExplanationSection topicId={topicId}>{visual}</VisualExplanationSection>
      <TryItYourselfSection topicId={topicId}>{tryIt}</TryItYourselfSection>
      <StepWalkthroughSection topicId={topicId}>{walkthrough}</StepWalkthroughSection>
      <MisconceptionsSection topicId={topicId}>{misconceptions}</MisconceptionsSection>
      <QuizSection topicId={topicId}>{quiz}</QuizSection>
      <PracticeChallengeSection topicId={topicId}>{practice}</PracticeChallengeSection>
    </article>
  );
}
