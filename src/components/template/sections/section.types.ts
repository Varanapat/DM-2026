import type { ReactNode } from 'react';

export interface SectionProps {
  topicId: string;
  children?: ReactNode;
  /** skip the generic "ภาพอธิบาย" heading + core-concept paragraph when the
   * page's own visual content already covers the intro (e.g. a custom definition card) */
  hideIntro?: boolean;
}
