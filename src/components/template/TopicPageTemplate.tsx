import { useState, type ReactNode } from 'react';
import { getTopicById } from '@/data/topics';
import { TOPIC_SECTIONS } from '@/data/sections';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { SectionSidebar } from '@/layouts/SectionSidebar';
import { SectionBottomSheet } from '@/layouts/SectionBottomSheet';
import { HookSection } from './sections/HookSection';
import { VisualExplanationSection } from './sections/VisualExplanationSection';
import { MisconceptionsSection } from './sections/MisconceptionsSection';
import { QuizSection } from './sections/QuizSection';
import styles from './TopicPageTemplate.module.css';

export interface TopicPageTemplateProps {
  topicId: string;
  /** Section content slots — omit any slot to fall back to a Phase-2 placeholder.
   * "visual" carries both the concept AND the step-by-step algorithm as one
   * merged animation timeline — there's no separate Try-It or Walkthrough slot. */
  hook?: ReactNode;
  visual?: ReactNode;
  misconceptions?: ReactNode;
  quiz?: ReactNode;
}

export function TopicPageTemplate({ topicId, hook, visual, misconceptions, quiz }: TopicPageTemplateProps) {
  const topic = getTopicById(topicId);
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState(TOPIC_SECTIONS[0].id);

  return (
    <article>
      {!isMobile && <SectionSidebar activeId={activeSection} onSelect={setActiveSection} />}

      <header className={styles.header}>
        <h1 className={styles.title}>{topic?.titleTh ?? topicId}</h1>
        {topic && <p className={styles.objective}>{topic.objectiveTh}</p>}
      </header>

      {activeSection === 'hook' && <HookSection topicId={topicId}>{hook}</HookSection>}
      {activeSection === 'visual-explanation' && <VisualExplanationSection topicId={topicId}>{visual}</VisualExplanationSection>}
      {activeSection === 'misconceptions' && <MisconceptionsSection topicId={topicId}>{misconceptions}</MisconceptionsSection>}
      {activeSection === 'quiz' && <QuizSection topicId={topicId}>{quiz}</QuizSection>}

      {isMobile && <SectionBottomSheet activeId={activeSection} onSelect={setActiveSection} />}
    </article>
  );
}
